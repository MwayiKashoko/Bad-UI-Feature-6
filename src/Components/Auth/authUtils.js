/**
 * Utility functions for authentication form validation and error handling
 */

/**
 * Validates email format using standard email regex pattern
 * 
 * This regex checks for basic email structure:
 * - Characters before @ symbol
 * - @ symbol
 * - Domain name
 * - Top-level domain (.com, .org, etc.)
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates login form fields (email and password)
 * 
 * Performs client-side validation to catch errors before API call.
 * This provides immediate feedback and reduces unnecessary server requests.
 * 
 * @param {Object} credentials - Object containing email and password
 * @returns {Object} - Object containing validation errors (empty object if valid)
 */
export const validateLoginForm = (credentials) => {
  const errors = {};

  // Check email presence and format
  // Using optional chaining (?.) and trim() handles null/undefined and whitespace-only strings
  if (!credentials.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(credentials.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Check password presence
  // Note: We don't validate password strength here - that's handled by backend
  if (!credentials.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Validates registration form fields (firstName, email, and password)
 * 
 * Registration requires additional validation (firstName) compared to login.
 * The minimum length check prevents obviously invalid names while keeping
 * the validation simple and user-friendly.
 * 
 * @param {Object} userData - Object containing firstName, email, and password
 * @returns {Object} - Object containing validation errors (empty object if valid)
 */
export const validateRegisterForm = (userData) => {
  const errors = {};

  // Validate firstName - required and must be meaningful length
  if (!userData.firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (userData.firstName.trim().length < 2) {
    // Minimum 2 characters prevents single-character or whitespace-only names
    errors.firstName = "First name must be at least 2 characters";
  }

  // Email validation (same as login)
  if (!userData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(userData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password presence check (strength validation handled by backend)
  if (!userData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

/**
 * Clears form field errors when user starts typing
 * 
 * Provides immediate feedback by removing error messages as soon as the user
 * begins correcting their input. This creates a more responsive, less frustrating UX.
 * 
 * 
 * @param {Object} errors - Current errors object from component state
 * @param {string} fieldName - Name of the field being edited (e.g., "email", "password")
 * @param {Function} setErrors - State setter function for errors from useState
 */
export const clearFieldErrors = (errors, fieldName, setErrors) => {
  // Clear error for the specific field being edited
  // This gives immediate feedback that the user is addressing that field's error
  if (errors[fieldName]) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }
  // Clear general errors when user starts typing any field
  // General errors often relate to overall form submission, so clearing them
  // on any input change indicates the user is actively fixing issues
  if (errors.general) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.general;
      return newErrors;
    });
  }
};

