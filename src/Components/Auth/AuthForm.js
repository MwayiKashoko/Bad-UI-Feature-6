import React from "react";

const AuthForm = ({ user, onChange, onSubmit, isRegister = false, errors = {} }) => {
  return (
    <div className="auth-form-wrapper">
      <form onSubmit={onSubmit} className="auth-form">
        {errors.general && (
          <div className="error-message error-general">
            {errors.general}
          </div>
        )}
        
        {isRegister ?
          <div className="form-field">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className={`form-input ${errors.firstName ? 'input-error' : ''}`}
              value={user.firstName}
              onChange={onChange}
              name="firstName"
              placeholder="First name"
              required
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>
          : null}

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
          <button type="submit" className="auth-submit-button" onSubmit={onSubmit}>
            {isRegister ? "Sign Up & Create Account" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
