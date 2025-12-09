import React, { useEffect, useState } from "react";
import { loginUser } from "./AuthService";
import AuthForm from "./AuthForm.js";
import GoogleAuthButton from "./GoogleAuthButton";
import { validateLoginForm, clearFieldErrors } from "./authUtils";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Auth.css";

/**
 * Login component for user authentication
 * 
 * Provides two authentication methods:
 * 1. Parse (email/password) - Traditional authentication for users who prefer it
 * 2. Auth0 (Google OAuth) - Social login for quick access
 * 
 * Redirect handling:
 * - Preserves intended destination when user is redirected here from protected route
 * - Stores redirect path in multiple places (URL param, location state, sessionStorage)
 *   to handle various navigation scenarios (direct URL, programmatic navigation, etc.)
 * - Cleans up URL parameters after reading them for cleaner URLs
 * - PublicRoute component handles redirecting already-authenticated users away
 */
const AuthLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loginWithRedirect } = useAuth0();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [doLogin, setDoLogin] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize redirect path from multiple sources (priority order matters)
  // 1. URL parameter (?redirect=...) - highest priority, from ProtectedRoute redirects
  // 2. Location state - from programmatic navigation with state
  // 3. SessionStorage - persisted across page refreshes
  // 4. Default to "/" if none found
  // Using function initializer prevents unnecessary re-runs on every render
  const [redirectPath] = useState(() => {
    const urlRedirect = searchParams.get("redirect");
    const stateRedirect = location.state?.redirectPath;
    const storedRedirect = sessionStorage.getItem("authRedirectPath");
    return urlRedirect || stateRedirect || storedRedirect || "/";
  });
  
  // Persist redirect path to sessionStorage for cross-component access
  // PublicRoute needs this to redirect authenticated users to their intended destination
  // Only store non-default paths to avoid cluttering sessionStorage
  useEffect(() => {
    if (redirectPath && redirectPath !== "/") {
      sessionStorage.setItem("authRedirectPath", redirectPath);
    }
  }, [redirectPath]);
  
  // Clean up URL parameter after reading it
  // This keeps URLs clean and prevents redirect paths from being visible/shared
  // Using replace: true prevents adding to browser history
  useEffect(() => {
    if (searchParams.get("redirect")) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("redirect");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  // Note: PublicRoute component handles redirecting already-authenticated users
  // No need for separate useEffect here - PublicRoute checks auth status on mount

  // Execute login API call when form is validated and submitted
  // Using doLogin flag prevents multiple simultaneous login attempts
  // This pattern separates validation (synchronous) from API call (asynchronous)
  useEffect(() => {
    if (doLogin) {
      loginUser(credentials.email, credentials.password).then((result) => {
        if (result.user) {
          // Login successful - navigate to intended destination
          // Clear sessionStorage to prevent stale redirect paths
          const finalRedirect = redirectPath;
          sessionStorage.removeItem("authRedirectPath");
          navigate(finalRedirect);
        } else if (result.error) {
          // Display server error (e.g., "Invalid credentials")
          setErrors({ general: result.error });
        }
        // Reset flag to allow future login attempts
        setDoLogin(false);
      });
    }
  }, [doLogin, credentials, navigate, redirectPath]);

  /**
   * Handles input field changes and clears related errors
   * 
   * Clearing errors immediately when user types provides better UX than
   * waiting until form submission. Users see the form responding to their input.
   */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    // Update only the changed field using computed property name
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors for the field being edited (immediate feedback)
    clearFieldErrors(errors, name, setErrors);
  };

  /**
   * Handles form submission with client-side validation
   * 
   * Validates before API call to catch errors early and reduce server load.
   * Only sets doLogin flag if validation passes, which triggers the useEffect above.
   */
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(credentials);
    
    // Show validation errors and stop if any found
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any previous errors and trigger login
    setErrors({});
    setDoLogin(true);
  };

  /**
   * Initiates Google OAuth login flow via Auth0
   * 
   * Preserves redirect path in appState so Auth0 can return user to intended
   * destination after authentication completes. Auth0 will redirect back to
   * the app with this path in appState.returnTo.
   */
  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2", // Specify Google as the OAuth provider
        screen_hint: "login" // Tell Auth0 to show login screen (not signup)
      },
      appState: {
        returnTo: redirectPath // Preserve where user wanted to go
      }
    });
  };

  return (
    <div className="auth-page-container">
      <Link to="/" className="back-to-home-button">
        Back to Home
      </Link>
      <div className="auth-form-container">
        <h1>Login</h1>
        <AuthForm 
          user={credentials}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
          errors={errors}
        />
        <div className="auth-divider">
          <span>or</span>
        </div>
        <GoogleAuthButton 
          onClick={handleGoogleLogin} 
          text="Continue with Google" 
        />
        <p>
          <Link 
            to="/register" 
            state={{ redirectPath: redirectPath }}
          >
            Don't have an account? Create one here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;
