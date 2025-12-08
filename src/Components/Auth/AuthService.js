import Parse from "parse";

/**
 * Authentication service for Parse backend
 * Handles user registration, login, logout, and authentication status
 * 
 * Note: This application uses dual authentication:
 * - Parse (email/password) for traditional authentication
 * - Auth0 (Google OAuth) for social authentication
 * Both systems work together to provide flexible authentication options
 */

/**
 * Creates a new user account in Parse backend
 * @param {Object} newUser - User object containing firstName, email, password, lastName (optional)
 * @returns {Promise<Object>} - Promise resolving to {user} on success or {error} on failure
 */
export const createUser = (newUser) => {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);

  return user
    .signUp()
    .then((newUserSaved) => {
      return { user: newUserSaved };
    })
    .catch((error) => {
      let errorMessage = "An error occurred during registration";
      
      // Parse error codes:
      // 202: Username/email already exists
      // 200: Username is required (missing)
      // 201: Password is required (missing)
      if (error.code === 202) {
        errorMessage = "This email is already registered. Please use a different email or login.";
      } else if (error.code === 200) {
        errorMessage = "Username is required";
      } else if (error.code === 201) {
        errorMessage = "Password is required";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { error: errorMessage };
    });
};

/**
 * Authenticates user with email and password via Parse
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Promise resolving to {user} on success or {error} on failure
 */
export const loginUser = (email, password) => {
  return Parse.User.logIn(email, password)
    .then((user) => {
      return { user: user };
    })
    .catch((error) => {
      let errorMessage = "An error occurred during login";
      
      // Parse error codes:
      // 101: Invalid login credentials (wrong email/password)
      // 200: Username/email is required (missing)
      // 201: Password is required (missing)
      if (error.code === 101) {
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
 * @returns {Promise} - Promise that resolves when logout is complete
 */
export const logoutUser = () => {
  return Parse.User.logOut().catch((error) => {
    alert(`Error: ${error.message}`);
  });
};

/**
 * Checks if a user is currently authenticated via Parse
 * Note: Auth0 authentication is checked separately using useAuth0 hook
 * @returns {boolean} - True if Parse user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return Boolean(Parse.User.current());
};
