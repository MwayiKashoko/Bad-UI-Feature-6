import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protected route component that restricts access to authenticated users only
 * 
 * This component acts as a guard for routes that require authentication.
 * When an unauthenticated user tries to access a protected route, they're
 * redirected to login with their intended destination preserved in the URL.
 * 
 * After login, AuthLogin reads the redirect parameter and sends them back
 * to where they originally wanted to go. This creates a seamless experience.
 * 
 * @param {React.Component} element - Component to render if authenticated
 * @param {boolean} isAuthed - Authentication status (true if user is authenticated via Parse or Auth0)
 * @returns {React.Component|Navigate} - Component if authenticated, Navigate component if not
 */
const ProtectedRoute = ({ element: Component, isAuthed }) => {
  const location = useLocation();
  
  // Allow access if authenticated
  if (isAuthed) return <Component />;

  // Redirect to login, preserving intended destination in URL parameter
  // encodeURIComponent ensures special characters in paths are handled correctly
  // Using 'replace' prevents adding redirect to browser history
  return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
};

export default ProtectedRoute;

