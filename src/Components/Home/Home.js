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
    // Generate clouds with random positions (no distinct channels)
    const generateClouds = () => {
      const NUM_CLOUDS = 8; // Total number of clouds
      const VIEWPORT_HEIGHT = window.innerHeight;
      
      // Welcome text area - avoid placing clouds here
      // Welcome container has margin-top: 300px and padding, text is ~48px
      const WELCOME_START_PX = 300; // Start of welcome text area
      const WELCOME_END_PX = 450; // End of welcome text area (300 + padding + text height)
      const BUFFER_ZONE = 100; // Buffer zone to ensure clouds don't overlap welcome text
      
      // Define areas where clouds can appear (above and below welcome text)
      const TOP_AREA_START = 50; // Start from 50px from top
      const TOP_AREA_END = WELCOME_START_PX - BUFFER_ZONE; // End before welcome text buffer
      const BOTTOM_AREA_START = WELCOME_END_PX + BUFFER_ZONE; // Start below welcome text buffer
      const BOTTOM_AREA_END = VIEWPORT_HEIGHT - 100; // Don't go all the way to bottom, leave 100px margin
      
      const cloudConfigs = [];
      let cloudId = 0;

      // Generate clouds with random positions
      for (let i = 0; i < NUM_CLOUDS; i++) {
        // Randomly decide if cloud goes above or below welcome text
        const isAbove = Math.random() < 0.5;
        
        // Random vertical position within the chosen area
        const top = isAbove
          ? TOP_AREA_START + Math.random() * (TOP_AREA_END - TOP_AREA_START)
          : BOTTOM_AREA_START + Math.random() * (BOTTOM_AREA_END - BOTTOM_AREA_START);
        
        // Random speed variation
        const baseSpeed = 30;
        const speedVariation = (Math.random() - 0.5) * 10; // ±5 seconds variation
        const speed = baseSpeed + speedVariation;
        
        // Random delay to spread clouds out
        const delay = Math.random() * 5; // Random delay 0-5s
        
        cloudConfigs.push({
          id: cloudId++,
          cloudNumber: Math.floor(Math.random() * 12) + 1, // Random cloud 1-12
          top: top, // Random position
          speed: speed, // Varied speed
          delay: delay, // Random delay
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

