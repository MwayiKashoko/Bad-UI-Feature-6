/**
 * Environment configuration module
 * Reads environment variables from .env file (via process.env)
 * 
 * Security Note: Never commit .env file to version control
 * The .env file contains sensitive API keys and credentials
 * 
 * For production deployment, set these as environment variables
 * in your hosting platform (Netlify, Vercel, etc.)
 */
module.exports = {
  REACT_APP_BACK4APP_APP_ID: process.env.REACT_APP_BACK4APP_APP_ID,
  REACT_APP_BACK4APP_JS_KEY: process.env.REACT_APP_BACK4APP_JS_KEY,
  REACT_APP_BACK4APP_URL: process.env.REACT_APP_BACK4APP_URL,
  REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN",
  REACT_APP_AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID"
};
