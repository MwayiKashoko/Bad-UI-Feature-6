import React, { useEffect, useState } from "react";
import { loginUser } from "./AuthService";
import AuthForm from "./AuthForm.js";
import GoogleAuthButton from "./GoogleAuthButton";
import { validateLoginForm, clearFieldErrors } from "./authUtils";
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Auth.css";

/**
 * Login component for user authentication
 * Handles both Parse (email/password) and Auth0 (Google OAuth) authentication
 * Redirects authenticated users away from login page
 */
const AuthLogin = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [doLogin, setDoLogin] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle login when form is submitted and validated
  useEffect(() => {
    if (doLogin) {
      loginUser(credentials.email, credentials.password).then((result) => {
        if (result.user) {
          navigate("/");
        } else if (result.error) {
          setErrors({ general: result.error });
        }
        setDoLogin(false);
      });
    }
  }, [doLogin, credentials, navigate]);

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
   */
  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        screen_hint: "login"
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
        <p><Link to="/register">Don't have an account? Create one here.</Link></p>
      </div>
    </div>
  );
};

export default AuthLogin;
