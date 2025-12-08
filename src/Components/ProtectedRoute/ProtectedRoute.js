import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protected route component that restricts access to authenticated users only
 * If user is not authenticated, redirects to home page
 * @param {React.Component} element - Component to render if authenticated
 * @param {boolean} isAuthed - Authentication status (true if user is authenticated)
 * @returns {React.Component|Navigate} - Component if authenticated, Navigate component if not
 */
const ProtectedRoute = ({ element: Component, isAuthed }) => {
  if (isAuthed) return <Component />;

  // Redirect unauthenticated users to home page
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;

