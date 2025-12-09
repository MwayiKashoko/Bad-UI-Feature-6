import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../Auth/AuthService.js";
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse";
import Cloud from "./Cloud";
import { getComponentDisplayName } from "../BadUIComponents/BadUIComponents";
import "./Home.css";

/**
 * Home page component - accessible to all users (public route)
 * 
 * This is the landing page that displays different content based on authentication status.
 * Authenticated users see personalized greeting and logout button, while unauthenticated
 * users see login/signup options.
 * 
 * The page also handles Auth0 callback redirects - when users complete Google OAuth,
 * Auth0 redirects back to the app, and this component checks if they had an intended
 * destination and sends them there.
 */
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout, user: auth0User, appState, isLoading: isAuth0Loading } = useAuth0();
  
  // Check authentication status from both systems
  // User is considered logged in if authenticated via either Parse or Auth0
  // Don't show buttons until Auth0 has finished loading to prevent flash of wrong buttons
  const isLoggedIn = isAuthenticated() || isAuth0Authenticated;
  const authStateReady = !isAuth0Loading; // Wait for Auth0 to finish checking auth state
  
  // Get current user from Parse (if authenticated via email/password)
  // This will be null if user authenticated via Auth0
  const currentUser = Parse.User.current();
  
  // Extract first name for personalized greeting
  // Parse stores firstName directly, but Auth0 provides different field names
  // Fallback chain: Parse firstName -> Auth0 given_name -> first word of name -> null
  const firstName = currentUser 
    ? currentUser.get("firstName") 
    : (auth0User?.given_name || auth0User?.name?.split(' ')[0] || null);

  // Handle Auth0 callback redirect after OAuth authentication
  // When Auth0 redirects back to the app, appState.returnTo contains the intended destination
  // We also check sessionStorage as a fallback for edge cases
  useEffect(() => {
    if (isAuth0Authenticated) {
      const redirectPath = appState?.returnTo || sessionStorage.getItem("authRedirectPath");
      if (redirectPath) {
        // Clear stored redirect and navigate to intended destination
        sessionStorage.removeItem("authRedirectPath");
        navigate(redirectPath);
      }
    }
  }, [isAuth0Authenticated, appState, navigate]);

  // Generate animated cloud configurations for background decoration
  // Clouds are generated once on mount and animate continuously
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    /**
     * Generates cloud configurations with varied properties for visual interest
     * 
     * This creates a continuous, non-repetitive animation effect.
     */
    const generateClouds = () => {
      const NUM_CLOUDS = 8; // Total number of clouds to display
      const CHANNEL_SPACING = 500; // Vertical spacing between cloud channels (prevents overlap)
      
      const cloudConfigs = [];
      let cloudId = 0;

      // Track cumulative delay to ensure sequential cloud launches
      // This prevents all clouds from appearing simultaneously
      let cumulativeDelay = 0;
      for (let i = 0; i < NUM_CLOUDS; i++) {
        // Position each cloud in its own channel, starting 50px from top
        // 500px spacing ensures clouds don't visually overlap during animation
        const top = 50 + (i * CHANNEL_SPACING);
        
        // Vary animation speed for natural, non-mechanical appearance
        // Base speed 30s with ±15s variation = 15-45s total animation duration
        const baseSpeed = 30;
        const speedVariation = (Math.random() - 0.5) * 30;
        const speed = baseSpeed + speedVariation;
        
        // Sequential delay: each cloud waits 10-20 seconds after the previous one
        // This creates a staggered launch effect rather than all clouds starting together
        let delay = 0;
        if (i > 0) {
          const delayBetweenClouds = 10 + Math.random() * 10; // Random 10-20 second delay
          cumulativeDelay += delayBetweenClouds;
          delay = cumulativeDelay;
        }
        
        cloudConfigs.push({
          id: cloudId++,
          cloudNumber: Math.floor(Math.random() * 12) + 1, // Random cloud image (1-12)
          top: top, // Vertical position in channel
          speed: speed, // Animation duration in seconds
          delay: delay, // Start delay in seconds
        });
      }

      setClouds(cloudConfigs);
    };

    // Generate clouds once on component mount
    generateClouds();
  }, []);

  /**
   * Handles logout for both authentication systems
   * 
   * 
   * Auth0 logout redirects to home page (handled by Auth0)
   * Parse logout clears local session, then we navigate manually
   */
  const handleLogout = async () => {
    if (isAuth0Authenticated) {
      // Auth0 handles redirect automatically via logoutParams
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      // Parse logout clears session, then navigate to home
      await logoutUser();
      navigate("/");
    }
  };

  // Array of bad UI components to display in the grid
  const badUIComponents = [
    "PhoneNumberRange",
    "BirthdayGuesser",
    "MathCAPTCH",
    "GuessTheNumber",
    "TetrisMarathon",
    "MarioGame",
    "PianoPieces",
    "TetrisInvisibleMode",
    "TetrisMasterMode",
    "TetrisSprint"
  ];


  return (
    <>
      {/* Cloud animation container */}
      <div className="cloud-container">
        {clouds.map((cloud) => (
          <Cloud
            key={cloud.id}
            cloudNumber={cloud.cloudNumber}
            top={cloud.top}
            speed={cloud.speed}
            delay={cloud.delay}
          />
        ))}
      </div>
      {/* Using Tailwind CSS for responsive padding and text centering */}
      {/* Always render container to reserve space and prevent layout shift */}
      {/* Only show welcome text after Auth0 has finished checking authentication state */}
      {/* This prevents flash of wrong welcome message on page load */}
      <div className="home-welcome-container p-8 text-center">
        {authStateReady ? (
          !isLoggedIn ? (
            <h1 className="home-welcome-text font-bold mb-6">
              Welcome to the home of Bad UI
            </h1>
          ) : (
            <h1 className="home-welcome-text font-bold mb-6">
              {firstName}, let's build some Bad UI
            </h1>
          )
        ) : (
          /* Placeholder to reserve space while Auth0 loads */
          <h1 className="home-welcome-text font-bold mb-6" style={{ visibility: 'hidden' }}>
            Welcome to the home of Bad UI
          </h1>
        )}
      </div>
      {/* Only show buttons after Auth0 has finished checking authentication state */}
      {/* This prevents flash of wrong buttons on page load */}
      {authStateReady && !isLoggedIn && (
        /* Tailwind: flexbox utilities for layout, gap for spacing between buttons */
        <div className="home-auth-container flex justify-center gap-4 mb-8">
          <Link to="/login" className="home-link">
            <button className="home-button">
              Login
            </button>
          </Link>
          <Link to="/register" className="home-link">
            <button className="home-button">
              Sign Up
            </button>
          </Link>
        </div>
      )}
      {authStateReady && isLoggedIn && (
        <div className="home-auth-container flex justify-center mb-8">
          {/* Logout button matching login and sign up button styling */}
          <button 
            className="home-button" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
      {/* Grid layout for Bad UI component gallery */}
      {/* Responsive: 1 column on mobile, 3 columns on tablet/desktop */}
      <div className="home-grid-container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
        {badUIComponents.map((componentName, index) => {
          /**
           * Handle grid box clicks - redirect to login if not authenticated
           * 
           * If user clicks a component while not logged in, we preserve their
           * intended destination (the component page) in the redirect parameter.
           * After login, they'll be sent to that component automatically.
           */
          const handleGridBoxClick = (e) => {
            if (!isLoggedIn) {
              e.preventDefault(); // Prevent navigation to protected route
              navigate(`/login?redirect=${encodeURIComponent(`/gallery/${componentName}`)}`);
            }
          };

          return (
            <Link
              key={index}
              to={`/gallery/${componentName}`}
              onClick={handleGridBoxClick}
              className="home-grid-box"
              style={{ 
                cursor: "pointer", 
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
              }}
            >
            <div style={{ padding: "20px" }}>
              {getComponentDisplayName(componentName)}
            </div>
          </Link>
          );
        })}
      </div>
    </>
  );
};

export default Home;

