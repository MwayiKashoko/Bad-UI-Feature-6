import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Public route component that prevents authenticated users from accessing public pages
 * Used for login/register pages - authenticated users should not see these pages
 * @param {React.Component} element - Component to render if not authenticated
 * @param {boolean} isAuthed - Authentication status (true if user is authenticated)
 * @returns {React.Component|Navigate} - Navigate component if authenticated, Component if not
 */
const PublicRoute = ({ element: Component, isAuthed }) => {
  // Redirect authenticated users to home page to prevent access to login/register
  if (isAuthed) return <Navigate to="/" replace />;
  return <Component />;
};

export default PublicRoute;
