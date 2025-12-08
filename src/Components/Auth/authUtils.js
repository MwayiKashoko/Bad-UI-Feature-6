/**
 * Utility functions for authentication form validation and error handling
 */

/**
 * Validates email format using standard email regex pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates login form fields (email and password)
 * @param {Object} credentials - Object containing email and password
 * @returns {Object} - Object containing validation errors (empty if valid)
 */
export const validateLoginForm = (credentials) => {
  const errors = {};

  if (!credentials.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(credentials.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!credentials.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Validates registration form fields (firstName, email, and password)
 * @param {Object} userData - Object containing firstName, email, and password
 * @returns {Object} - Object containing validation errors (empty if valid)
 */
export const validateRegisterForm = (userData) => {
  const errors = {};

  if (!userData.firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (userData.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  if (!userData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(userData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!userData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Clears form field errors when user starts typing
 * Removes both field-specific errors and general errors for better UX
 * This function should be called within the onChange handler
 * @param {Object} errors - Current errors object
 * @param {string} fieldName - Name of the field being edited
 * @param {Function} setErrors - State setter function for errors
 */
export const clearFieldErrors = (errors, fieldName, setErrors) => {
  // Clear error for the specific field being edited
  if (errors[fieldName]) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }
  // Clear general error when user starts typing any field
  if (errors.general) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.general;
      return newErrors;
    });
  }
};

