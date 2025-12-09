import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protected route component that restricts access to authenticated users only
 * If user is not authenticated, redirects to login page with return path
 * @param {React.Component} element - Component to render if authenticated
 * @param {boolean} isAuthed - Authentication status (true if user is authenticated)
 * @returns {React.Component|Navigate} - Component if authenticated, Navigate component if not
 */
const ProtectedRoute = ({ element: Component, isAuthed }) => {
  const location = useLocation();
  
  if (isAuthed) return <Component />;

  // Redirect unauthenticated users to login page, preserving the intended destination
  return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
};

export default ProtectedRoute;

