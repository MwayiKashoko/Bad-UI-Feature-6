import Parse from "parse";

/**
 * Authentication service for Parse backend (Back4App)
 * 
 * This service handles all Parse-specific authentication operations, separate from
 * Auth0's OAuth flow. Keeping them separate allows each system to work independently
 * while sharing the same protected routes.
 */

/**
 * Creates a new user account in Parse backend
 * 
 * Uses Parse's signUp() method which automatically:
 * - Validates email format
 * - Hashes the password securely
 * - Creates a user session
 * - Returns the authenticated user object
 * 
 * @param {Object} newUser - User object containing firstName, email, password, lastName (optional)
 * @returns {Promise<Object>} - Promise resolving to {user} on success or {error} on failure
 */
export const createUser = (newUser) => {
  const user = new Parse.User();

  // Set user properties before signup
  // Using email as username ensures uniqueness and simplifies login
  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);

  return user
    .signUp()
    .then((newUserSaved) => {
      // Return user object wrapped in success format
      // This consistent format makes error handling easier in components
      return { user: newUserSaved };
    })
    .catch((error) => {
      // Convert Parse error codes to user-friendly messages
      // Parse uses numeric codes, but users need clear text explanations
      let errorMessage = "An error occurred during registration";
      
      // Parse error codes (from Parse SDK documentation):
      // 202: Username/email already exists - most common registration error
      // 200: Username is required (missing) - validation error
      // 201: Password is required (missing) - validation error
      if (error.code === 202) {
        errorMessage = "This email is already registered. Please use a different email or login.";
      } else if (error.code === 200) {
        errorMessage = "Username is required";
      } else if (error.code === 201) {
        errorMessage = "Password is required";
      } else if (error.message) {
        // Fallback to Parse's error message if we don't recognize the code
        errorMessage = error.message;
      }
      
      return { error: errorMessage };
    });
};

/**
 * Authenticates user with email and password via Parse
 * 
 * Uses Parse's logIn() method which:
 * - Validates credentials against the backend
 * - Creates a session token stored in localStorage
 * - Returns the authenticated user object
 * - Throws error if credentials are invalid
 * 
 * @param {string} email - User's email address (used as username)
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Promise resolving to {user} on success or {error} on failure
 */
export const loginUser = (email, password) => {
  return Parse.User.logIn(email, password)
    .then((user) => {
      // Return consistent format matching createUser
      return { user: user };
    })
    .catch((error) => {
      // Convert technical error codes to user-friendly messages
      let errorMessage = "An error occurred during login";
      
      // Parse error codes:
      // 101: Invalid login credentials - wrong email/password combination
      // 200: Username/email is required - validation error
      // 201: Password is required - validation error
      if (error.code === 101) {
        // Don't reveal which field is wrong (security best practice)
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === 200) {
        errorMessage = "Email is required";
      } else if (error.code === 201) {
        errorMessage = "Password is required";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { error: errorMessage };
    });
};

/**
 * Logs out the current Parse user session
 * 
 * Clears the session token from localStorage and invalidates the current user.
 * After logout, Parse.User.current() will return null.
 * 
 * Note: This only logs out Parse sessions. Auth0 sessions must be logged out
 * separately using Auth0's logout method.
 * 
 * @returns {Promise} - Promise that resolves when logout is complete
 */
export const logoutUser = () => {
  return Parse.User.logOut().catch((error) => {
    // Show error to user if logout fails (rare, but possible)
    alert(`Error: ${error.message}`);
  });
};

/**
 * Checks if a user is currently authenticated via Parse
 * 
 * This is a synchronous check that reads from Parse's in-memory session.
 * For Auth0 authentication status, use the useAuth0 hook's isAuthenticated property.
 * 
 * Why separate checks?
 * - Parse stores session in localStorage (synchronous access)
 * - Auth0 uses tokens that may need to be validated (asynchronous)
 * - Components need to check both to determine overall auth status
 * 
 * @returns {boolean} - True if Parse user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  // Boolean() ensures we return true/false, not a user object or null
  return Boolean(Parse.User.current());
};
