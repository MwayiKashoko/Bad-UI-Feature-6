import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Public route component that prevents authenticated users from accessing public pages
 * 
 * This component ensures authenticated users don't see login/register pages, which
 * would be confusing UX. Instead, they're redirected to their intended destination
 * (if they came from a protected route) or the home page.
 * 
 * 
 * Clearing sessionStorage after reading prevents stale redirect paths from
 * persisting after the user has already been redirected.
 * 
 * @param {React.Component} element - Component to render if not authenticated
 * @param {boolean} isAuthed - Authentication status (true if user is authenticated via Parse or Auth0)
 * @returns {React.Component|Navigate} - Navigate component if authenticated, Component if not
 */
const PublicRoute = ({ element: Component, isAuthed }) => {
  const location = useLocation();
  
  // Redirect authenticated users away from public pages
  if (isAuthed) {
    // Check multiple sources for redirect path (priority order matters)
    const stateRedirect = location.state?.redirectPath;
    const storedRedirect = sessionStorage.getItem("authRedirectPath");
    const redirectPath = stateRedirect || storedRedirect || "/";
    
    // Clean up sessionStorage to prevent stale redirects
    // Only clear if we actually read from it (not if it was null)
    if (storedRedirect) {
      sessionStorage.removeItem("authRedirectPath");
    }
    
    // Redirect with replace to avoid adding to browser history
    return <Navigate to={redirectPath} replace />;
  }
  // Show public page (login/register) to unauthenticated users
  return <Component />;
};

export default PublicRoute;
