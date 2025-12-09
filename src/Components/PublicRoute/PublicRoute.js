import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Public route component that prevents authenticated users from accessing public pages
 * Used for login/register pages - authenticated users should not see these pages
 * Respects redirect path from location state or sessionStorage to send users to their intended destination
 * @param {React.Component} element - Component to render if not authenticated
 * @param {boolean} isAuthed - Authentication status (true if user is authenticated)
 * @returns {React.Component|Navigate} - Navigate component if authenticated, Component if not
 */
const PublicRoute = ({ element: Component, isAuthed }) => {
  const location = useLocation();
  
  // Redirect authenticated users to their intended destination or home page
  if (isAuthed) {
    const stateRedirect = location.state?.redirectPath;
    const storedRedirect = sessionStorage.getItem("authRedirectPath");
    const redirectPath = stateRedirect || storedRedirect || "/";
    
    // Clear stored redirect after reading it
    if (storedRedirect) {
      sessionStorage.removeItem("authRedirectPath");
    }
    
    return <Navigate to={redirectPath} replace />;
  }
  return <Component />;
};

export default PublicRoute;
