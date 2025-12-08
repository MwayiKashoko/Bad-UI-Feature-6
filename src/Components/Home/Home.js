import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../Auth/AuthService.js";
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse";
import Cloud from "./Cloud";
import "./Home.css";

/**
 * Home page component - accessible to all users
 * Displays different content based on authentication status
 * Handles both Parse and Auth0 authentication systems
 */
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout, user: auth0User } = useAuth0();
  
  // Check authentication status from both systems
  const isLoggedIn = isAuthenticated() || isAuth0Authenticated;
  
  // Get current user from Parse (if authenticated via email/password)
  const currentUser = Parse.User.current();
  
  // Extract first name based on authentication method
  // Parse users: firstName from Parse user object
  // Auth0 users: given_name or first word of name from Auth0 profile
  const firstName = currentUser 
    ? currentUser.get("firstName") 
    : (auth0User?.given_name || auth0User?.name?.split(' ')[0] || null);

  // Generate random cloud configurations
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    // Generate clouds in distinct channels spaced 500px apart
    const generateClouds = () => {
      const NUM_CLOUDS = 8; // Total number of clouds
      const CHANNEL_SPACING = 500; // Space between channels in pixels
      
      const cloudConfigs = [];
      let cloudId = 0;

      // Generate clouds in distinct channels
      let cumulativeDelay = 0; // Track cumulative delay for sequential launches
      for (let i = 0; i < NUM_CLOUDS; i++) {
        // Each cloud gets its own channel, spaced 500px apart
        const top = 50 + (i * CHANNEL_SPACING); // Start at 50px, then 500px increments
        
        // Random speed variation - wider range for more variety
        const baseSpeed = 30;
        const speedVariation = (Math.random() - 0.5) * 30; // ±15 seconds variation (15-45 seconds total)
        const speed = baseSpeed + speedVariation;
        
        // Sequential delay: each cloud waits 10-20 seconds after the previous one
        let delay = 0;
        if (i > 0) {
          // Add 10-20 second delay after the previous cloud
          const delayBetweenClouds = 10 + Math.random() * 10; // Random delay between 10-20 seconds
          cumulativeDelay += delayBetweenClouds;
          delay = cumulativeDelay;
        }
        
        cloudConfigs.push({
          id: cloudId++,
          cloudNumber: Math.floor(Math.random() * 12) + 1, // Random cloud 1-12
          top: top, // Channel position spaced 500px apart
          speed: speed, // Varied speed
          delay: delay, // Sequential delay: 10-20s after previous cloud
        });
      }

      setClouds(cloudConfigs);
    };

    generateClouds();
  }, []);

  /**
   * Handles logout for both authentication systems
   * Auth0: Uses Auth0 logout with redirect to home
   * Parse: Logs out Parse session and stays on home page
   */
  const handleLogout = async () => {
    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      await logoutUser();
      navigate("/");
    }
  };

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
      <div className="home-welcome-container p-8 text-center">
        {!isLoggedIn ? (
          <h1 className="home-welcome-text font-bold mb-6">Welcome to the home of Bad UI</h1>
        ) : (
          <h1 className="home-welcome-text font-bold mb-6">
            {firstName}, let's build some bad UI
          </h1>
        )}
      </div>
      {!isLoggedIn && (
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
      {isLoggedIn && (
        <div className="home-auth-container flex justify-center mb-8">
          {/* Tailwind: logout button with red styling and hover effects */}
          <button 
            className="home-button bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
      {/* Tailwind: grid layout with responsive columns and gap spacing */}
      <div className="home-grid-container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="home-grid-box"></div>
        ))}
      </div>
    </>
  );
};

export default Home;

