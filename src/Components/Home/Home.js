import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../Auth/AuthService.js";
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse";
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
      {/* Using Tailwind CSS for responsive padding and text centering */}
      <div className="home-welcome-container p-8 text-center">
        {!isLoggedIn ? (
          /* Tailwind: text-3xl for large text, font-bold, mb-6 for margin-bottom */
          <h1 className="home-welcome-text text-3xl font-bold mb-6">Welcome to the home of Bad UI</h1>
        ) : (
          <h1 className="home-welcome-text text-3xl font-bold mb-6">
            {firstName}, let's build some bad UI
          </h1>
        )}
      </div>
      {!isLoggedIn && (
        /* Tailwind: flexbox utilities for layout, gap for spacing between buttons */
        <div className="home-auth-container flex justify-center gap-4 mb-8">
          <Link to="/login" className="home-link">
            {/* Tailwind: button styling with blue background, hover effects, rounded corners */}
            <button className="home-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl">
              Login
            </button>
          </Link>
          <Link to="/register" className="home-link">
            <button className="home-button bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl">
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
      <div className="home-grid-container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          /* Tailwind: box styling with background, rounded corners, padding, and hover effects */
          <div key={index} className="home-grid-box bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all duration-200"></div>
        ))}
      </div>
    </>
  );
};

export default Home;

