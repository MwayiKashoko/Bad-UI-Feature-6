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
 * Handles both Parse (email/password) and Auth0 (Google OAuth) authentication
 * Redirects authenticated users away from login page
 * Supports redirect parameter to return users to their intended destination after login
 * Hides URL parameter after reading it and preserves it when navigating to signup
 */
const AuthLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [doLogin, setDoLogin] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Store redirect path in state - read from URL or location state, then clean up URL
  const [redirectPath, setRedirectPath] = useState(() => {
    const urlRedirect = searchParams.get("redirect");
    const stateRedirect = location.state?.redirectPath;
    const storedRedirect = sessionStorage.getItem("authRedirectPath");
    return urlRedirect || stateRedirect || storedRedirect || "/";
  });
  
  // Store redirect path in sessionStorage so PublicRoute can access it after auth
  useEffect(() => {
    if (redirectPath && redirectPath !== "/") {
      sessionStorage.setItem("authRedirectPath", redirectPath);
    }
  }, [redirectPath]);
  
  // Clean up URL parameter after reading it
  useEffect(() => {
    if (searchParams.get("redirect")) {
      // Remove redirect parameter from URL to hide it
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("redirect");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  // Note: PublicRoute handles redirecting authenticated users, so we don't need a separate useEffect here

  // Handle login when form is submitted and validated
  useEffect(() => {
    if (doLogin) {
      loginUser(credentials.email, credentials.password).then((result) => {
        if (result.user) {
          // Clear stored redirect path and navigate
          const finalRedirect = redirectPath;
          sessionStorage.removeItem("authRedirectPath");
          navigate(finalRedirect);
        } else if (result.error) {
          setErrors({ general: result.error });
        }
        setDoLogin(false);
      });
    }
  }, [doLogin, credentials, navigate, redirectPath]);

  /**
   * Handles input field changes and clears related errors for better UX
   */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors for the field being edited
    clearFieldErrors(errors, name, setErrors);
  };

  /**
   * Handles form submission with validation
   */
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(credentials);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setDoLogin(true);
  };

  /**
   * Initiates Google OAuth login flow via Auth0
   * Preserves redirect path in appState for after authentication
   */
  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        screen_hint: "login"
      },
      appState: {
        returnTo: redirectPath
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
