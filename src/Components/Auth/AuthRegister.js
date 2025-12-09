import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import GoogleAuthButton from "./GoogleAuthButton";
import { validateRegisterForm, clearFieldErrors } from "./authUtils";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Auth.css";

/**
 * Registration component for new user sign-up
 * Handles both Parse (email/password) and Auth0 (Google OAuth) authentication
 * Redirects authenticated users away from registration page
 * Supports redirect parameter to return users to their intended destination after signup
 * Hides URL parameter after reading it and preserves it when navigating to login
 */
const AuthRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [newUser, setNewUser] = useState({
    firstName: "",
    email: "",
    password: "",
  });

  // Flag to trigger user creation when form is submitted and validated
  const [add, setAdd] = useState(false);
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

  // Handle user creation when form is submitted and validated
  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((result) => {
        if (result.user) {
          // Clear stored redirect path and navigate
          const finalRedirect = redirectPath;
          sessionStorage.removeItem("authRedirectPath");
          navigate(finalRedirect);
        } else if (result.error) {
          setErrors({ general: result.error });
        }
        setAdd(false);
      });
    }
  }, [newUser, add, navigate, redirectPath]);

  /**
   * Handles input field changes and clears related errors for better UX
   */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    
    // Clear errors for the field being edited
    clearFieldErrors(errors, name, setErrors);
  };

  /**
   * Handles form submission with validation
   */
  const onSubmitHandler = (e) => {
    e.preventDefault();
    
    const validationErrors = validateRegisterForm(newUser);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setAdd(true);
  };

  /**
   * Initiates Google OAuth sign-up flow via Auth0
   * Preserves redirect path in appState for after authentication
   */
  const handleGoogleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        screen_hint: "signup"
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
        <h1>Sign Up</h1>
        <AuthForm
          user={newUser}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
          isRegister={true}
          errors={errors}
        />
        <div className="auth-divider">
          <span>or</span>
        </div>
        <GoogleAuthButton 
          onClick={handleGoogleSignUp} 
          text="Sign up with Google" 
        />
        <p>
          <Link 
            to="/login" 
            state={{ redirectPath: redirectPath }}
          >
            Already have an account? Login here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthRegister;
