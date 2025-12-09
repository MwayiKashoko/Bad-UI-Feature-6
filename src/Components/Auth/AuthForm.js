import React from "react";
import "./Auth.css";

/**
 * Reusable authentication form component
 * 
 * This component eliminates code duplication by handling both login and registration
 * forms. The conditional firstName field and button text make it flexible enough
 * for both use cases while maintaining a single source of truth for form structure.
 * 
 * Why a single component instead of separate login/register forms?
 * - Shared styling and layout logic
 * - Consistent validation error display
 * - Easier maintenance (one place to update form structure)
 * - Both forms have identical email/password fields
 * 
 * @param {Object} user - User object containing form field values (controlled component pattern)
 * @param {Function} onChange - Handler for input field changes (updates parent state)
 * @param {Function} onSubmit - Handler for form submission (prevents default, calls parent handler)
 * @param {boolean} isRegister - If true, shows firstName field and "Sign Up" button text
 * @param {Object} errors - Object containing validation error messages keyed by field name
 */
const AuthForm = ({ user, onChange, onSubmit, isRegister = false, errors = {} }) => {
  return (
    <div className="auth-form-wrapper">
      <form onSubmit={onSubmit} className="auth-form">
        {/* Display general errors (like "Invalid credentials") above form fields */}
        {/* These are server-side errors that don't belong to a specific field */}
        {errors.general && (
          <div className="error-message error-general">
            {errors.general}
          </div>
        )}
        
        {/* Conditionally render firstName field only for registration */}
        {/* Login doesn't need firstName, so hiding it keeps the form clean */}
        {isRegister ? (
          <div className="form-field">
            <label className="form-label">First Name</label>
            <input
              type="text"
              // Dynamically add error styling class when field has validation error
              // This provides visual feedback alongside the error message
              className={`form-input ${errors.firstName ? 'input-error' : ''}`}
              value={user.firstName}
              onChange={onChange}
              name="firstName"
              placeholder="First name"
              required
            />
            {/* Show field-specific error message below input */}
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>
        ) : null}

        <div className="form-field">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            value={user.email}
            onChange={onChange}
            name="email"
            placeholder="Email"
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        <div className="form-field">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            value={user.password}
            onChange={onChange}
            name="password"
            placeholder="Password"
            min="0"
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        <div className="form-field">
          <button type="submit" className="auth-submit-button">
            {isRegister ? "Sign Up & Create Account" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
