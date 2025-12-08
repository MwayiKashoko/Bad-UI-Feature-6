import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Auth/AuthService";
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse";
import "./Main.css";

/**
 * Main user dashboard component (protected route)
 * Displays user information and logout functionality
 * Handles both Parse and Auth0 authentication systems
 */
const MainGood = () => {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout, user: auth0User } = useAuth0();
  
  // Get current user from Parse (if authenticated via email/password)
  const currentUser = Parse.User.current();
  
  // Determine display name based on authentication method
  // Parse users: firstName + lastName
  // Auth0 users: name or email from Auth0 profile
  const userName = currentUser
    ? `${currentUser.get("firstName")} ${currentUser.get("lastName")}`
    : auth0User?.name || auth0User?.email || "Guest";

  /**
   * Handles logout for both authentication systems
   * Auth0: Uses Auth0 logout with redirect
   * Parse: Logs out Parse session and navigates to login
   */
  const handleLogout = async () => {
    if (isAuth0Authenticated) {
      // Auth0 logout redirects user to home page
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      // Parse logout - clear session and navigate to login
      await logoutUser();
      navigate("/login");
    }
  };

  // Using Tailwind CSS utility classes for styling
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Tailwind: text-xl for larger heading, font-bold for weight, mb-4 for margin */}
      <h1 className="text-xl font-bold mb-4 text-white">User: {userName}</h1>
      {/* Tailwind: button styling with hover effects, rounded corners, padding, and transitions */}
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default MainGood;
