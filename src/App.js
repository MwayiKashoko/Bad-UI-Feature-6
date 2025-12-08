import React from "react";
import Components from "./Components/Components.js";
import * as Env from "./environments";
import Parse from "parse";
import { Auth0Provider } from "@auth0/auth0-react";

/**
 * Initialize Parse backend connection
 * Parse handles email/password authentication and user data storage
 */
Parse.initialize(Env.REACT_APP_BACK4APP_APP_ID, Env.REACT_APP_BACK4APP_JS_KEY);
Parse.serverURL = Env.REACT_APP_BACK4APP_URL;

/**
 * Main App component
 * Wraps application with Auth0Provider for Google OAuth authentication
 * The app uses dual authentication:
 * - Parse: Email/password authentication
 * - Auth0: Google OAuth social authentication
 */
function App() {
  return (
    <Auth0Provider
      domain={Env.REACT_APP_AUTH0_DOMAIN}
      clientId={Env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      // Required for production: Add your Netlify URL to Auth0 dashboard
      // Allowed Callback URLs: https://feature6.netlify.app
      // Allowed Logout URLs: https://feature6.netlify.app
      // Allowed Web Origins: https://feature6.netlify.app
      cacheLocation="localstorage"
    >
      <Components />
    </Auth0Provider>
  );
}

export default App;
