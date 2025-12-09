import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AuthRegister from "./Auth/AuthRegister.js";
import AuthLogin from "./Auth/AuthLogin.js";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.js";
import PublicRoute from "./PublicRoute/PublicRoute.js";
import Main from "./Main/MainGood.js";
import Home from "./Home/Home.js";
import BadUIPage from "./Home/BadUIPage.js";
import { isAuthenticated } from "./Auth/AuthService.js";

/**
 * Route wrapper component that manages authentication state across the app
 * 
 * This component centralizes authentication checking so routes can react to
 * login/logout events in real-time. Without this, routes might show stale
 * authentication state after a user logs in or out.
 * 
 * Why check both systems?
 * - Parse: Synchronous check via Parse.User.current()
 * - Auth0: Asynchronous check via useAuth0 hook (may take time to initialize)
 * 
 * We check both because users can authenticate via either system, and we need
 * to know their status regardless of which method they used.
 */
const AuthRoutes = () => {
  const location = useLocation();
  const { isAuthenticated: isAuth0Authenticated } = useAuth0();
  
  // Initialize state with current auth status from both systems
  // Using function initializer prevents unnecessary re-renders on mount
  const [authorized, setAuthorized] = useState(() => 
    isAuthenticated() || isAuth0Authenticated
  );

  // Update auth state when route changes or Auth0 status changes
  // This handles edge cases like:
  // - User logs out in another tab (sessionStorage clears)
  // - Auth0 token expires and refreshes
  // - User navigates after login/logout
  useEffect(() => {
    setAuthorized(isAuthenticated() || isAuth0Authenticated);
  }, [location, isAuth0Authenticated]);

  return (
    <Routes>
      {/* Public home page - no authentication required */}
      <Route path="/" element={<Home />} />
      
      {/* Legacy route - redirects old /auth URLs to login for backwards compatibility */}
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      
      {/* Public routes - show login/register only to unauthenticated users */}
      {/* Using PublicRoute prevents authenticated users from seeing login pages,
          which would be confusing UX. Instead, they're redirected to their intended destination. */}
      <Route
        path="/register"
        element={<PublicRoute element={AuthRegister} isAuthed={authorized} />}
      />
      <Route
        path="/login"
        element={<PublicRoute element={AuthLogin} isAuthed={authorized} />}
      />
      
      {/* Protected user dashboard - requires authentication */}
      <Route
        path="/user"
        element={<ProtectedRoute element={Main} isAuthed={authorized} />}
      />
      
      {/* Bad UI gallery pages - protected to prevent unauthorized access */}
      {/* These pages contain interactive CAPTCHA challenges that should only be
          accessible to authenticated users */}
      <Route 
        path="/gallery/:componentName" 
        element={<ProtectedRoute element={BadUIPage} isAuthed={authorized} />} 
      />
      
      {/* Catch-all route - handles 404s by redirecting to home */}
      {/* Using 'replace' prevents back button from going to invalid URLs */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Main routing component - wraps app with React Router
 * 
 * Router must be at this level to provide routing context to all child components.
 * Placing it here (rather than in App.js) keeps routing logic separate from
 * authentication provider setup, improving code organization.
 */
const Components = () => {
  return (
    <Router>
      <AuthRoutes />
    </Router>
  );
};

export default Components;
