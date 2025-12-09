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
import BadUIPage from "./BadUI/BadUIPage.js";
import { isAuthenticated } from "./Auth/AuthService.js";

/**
 * Route wrapper component that manages authentication state
 * Checks both Parse and Auth0 authentication status dynamically
 * Updates authorization state when route changes to handle login/logout scenarios
 */
const AuthRoutes = () => {
  const location = useLocation();
  const { isAuthenticated: isAuth0Authenticated } = useAuth0();
  
  // Initialize authorization state by checking both authentication systems
  // User can be authenticated via Parse (email/password) or Auth0 (Google OAuth)
  const [authorized, setAuthorized] = useState(() => 
    isAuthenticated() || isAuth0Authenticated
  );

  // Re-check authentication status when route changes or Auth0 status updates
  // This ensures protected/public routes respond correctly to login/logout events
  useEffect(() => {
    setAuthorized(isAuthenticated() || isAuth0Authenticated);
  }, [location, isAuth0Authenticated]);

  return (
    <Routes>
      {/* Home page - accessible to everyone */}
      <Route path="/" element={<Home />} />
      
      {/* Legacy route redirect */}
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      
      {/* Public routes - redirect authenticated users to home page */}
      {/* Prevents logged-in users from accessing login/register pages */}
      <Route
        path="/register"
        element={<PublicRoute element={AuthRegister} isAuthed={authorized} />}
      />
      <Route
        path="/login"
        element={<PublicRoute element={AuthLogin} isAuthed={authorized} />}
      />
      
      {/* Protected route - requires authentication, redirects to home if not authenticated */}
      <Route
        path="/user"
        element={<ProtectedRoute element={Main} isAuthed={authorized} />}
      />
      
      {/* Bad UI pages - now protected, requires authentication */}
      <Route 
        path="/gallery/:componentName" 
        element={<ProtectedRoute element={BadUIPage} isAuthed={authorized} />} 
      />
      
      {/* Catch-all route - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Main routing component that wraps the application with React Router
 */
const Components = () => {
  return (
    <Router>
      <AuthRoutes />
    </Router>
  );
};

export default Components;
