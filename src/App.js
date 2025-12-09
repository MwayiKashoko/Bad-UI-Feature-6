import React from "react";
import Components from "./Components/Components.js";
import * as Env from "./environments";
import Parse from "parse";
import { Auth0Provider } from "@auth0/auth0-react";

/**
 * Initialize Parse SDK connection to Back4App backend
 * 
 * Parse is initialized here (not in a component) because it needs to be available
 * globally before any components try to use it. This ensures authentication state
 * persists across page refreshes and component remounts.
 * 
 * Back4App provides the Parse backend infrastructure, handling:
 * - User registration and email/password authentication
 * - User data persistence and storage
 * - Session management
 */
Parse.initialize(Env.REACT_APP_BACK4APP_APP_ID, Env.REACT_APP_BACK4APP_JS_KEY);
Parse.serverURL = Env.REACT_APP_BACK4APP_URL;

/**
 * Root App component - Entry point for the React application
 * 
 * Wraps the entire app with Auth0Provider to enable Google OAuth authentication.
 * Auth0Provider must be at the root level so all child components can access
 * Auth0 context via the useAuth0 hook.
 * 
 * Dual Authentication Strategy:
 * - Parse: Traditional email/password authentication (for users who prefer it)
 * - Auth0: Social OAuth authentication (for users who want quick Google login)
 * 
 * Both systems work independently but share the same protected routes, giving
 * users flexibility in how they authenticate.
 */
function App() {
  return (
    <Auth0Provider
      domain={Env.REACT_APP_AUTH0_DOMAIN}
      clientId={Env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        // Use current origin so Auth0 redirects back to the same domain
        // This works for both localhost (development) and production URLs
        redirect_uri: window.location.origin
      }}
      // Production deployment requires Auth0 dashboard configuration:
      // - Allowed Callback URLs: https://feature6.netlify.app
      // - Allowed Logout URLs: https://feature6.netlify.app  
      // - Allowed Web Origins: https://feature6.netlify.app
      // Without these, Auth0 will reject authentication requests from production
      cacheLocation="localstorage"
    >
      <Components />
    </Auth0Provider>
  );
}

export default App;
