import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import GoogleAuthButton from "./GoogleAuthButton";
import { validateRegisterForm, clearFieldErrors } from "./authUtils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Auth.css";

/**
 * Registration component for new user sign-up
 * Handles both Parse (email/password) and Auth0 (Google OAuth) authentication
 * Redirects authenticated users away from registration page
 */
const AuthRegister = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [newUser, setNewUser] = useState({
    firstName: "",
    email: "",
    password: "",
  });

  // Flag to trigger user creation when form is submitted and validated
  const [add, setAdd] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect authenticated users away from registration page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle user creation when form is submitted and validated
  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((result) => {
        if (result.user) {
          navigate("/");
        } else if (result.error) {
          setErrors({ general: result.error });
        }
        setAdd(false);
      });
    }
  }, [newUser, add, navigate]);

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
   */
  const handleGoogleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        screen_hint: "signup"
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
        <p><Link to="/login">Already have an account? Login here.</Link></p>
      </div>
    </div>
  );
};

export default AuthRegister;
