import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Auth/AuthService";
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse";
import "./Main.css";

/**
 * Main user dashboard component (protected route)
 * 
 * This is the user's personal dashboard, accessible only after authentication.
 * Displays user information and provides logout functionality. The component
 * adapts to show information from either Parse or Auth0 based on which system
 * authenticated the user.
 */
const MainGood = () => {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout, user: auth0User } = useAuth0();
  
  // Get current user from Parse (will be null if authenticated via Auth0)
  const currentUser = Parse.User.current();
  
  // Determine display name based on authentication method
  // Parse stores firstName and lastName separately, so we combine them
  // Auth0 provides name as a single field, or we fall back to email
  // "Guest" is a final fallback (shouldn't happen on protected route)
  const userName = currentUser
    ? `${currentUser.get("firstName")} ${currentUser.get("lastName")}`
    : auth0User?.name || auth0User?.email || "Guest";

  /**
   * Handles logout for both authentication systems
   * 
   * Different logout flows:
   * - Auth0: Redirects to home page automatically (handled by Auth0)
   * - Parse: Clears session locally, then navigate to login page manually
   * 
   * We check which system authenticated the user to call the correct logout method.
   */
  const handleLogout = async () => {
    if (isAuth0Authenticated) {
      // Auth0 handles redirect via logoutParams
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      // Parse logout clears session, then navigate manually
      await logoutUser();
      navigate("/login");
    }
  };

  // Using Tailwind CSS utility classes for styling
  return (
    <div className="p-6 max-w-2xl mx-auto main-container">
      {/* Tailwind: text-xl for larger heading, font-bold for weight, mb-4 for margin */}
      <h1 className="text-xl font-bold mb-4 text-white">User: {userName}</h1>
      {/* Logout button uses CSS class for consistent styling with other buttons */}
      <button 
        className="main-logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default MainGood;
