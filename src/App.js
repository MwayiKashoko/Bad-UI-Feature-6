import React from "react";
import Components from "./Components/Components.js";
import * as Env from "./environments";
import Parse from "parse";
import { Auth0Provider } from "@auth0/auth0-react";

Parse.initialize(Env.REACT_APP_BACK4APP_APP_ID, Env.REACT_APP_BACK4APP_JS_KEY);
Parse.serverURL = Env.REACT_APP_BACK4APP_URL;

function App() {
  return (
    <Auth0Provider
      domain={Env.REACT_APP_AUTH0_DOMAIN}
      clientId={Env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Components />
    </Auth0Provider>
  );
}

export default App;
