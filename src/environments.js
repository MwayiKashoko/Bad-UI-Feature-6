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
  REACT_APP_BACK4APP_APP_ID: process.env.REACT_APP_BACK4APP_APP_ID || '6zh91YxJwMwtcqZeCnu7rE2rfXNZAeTvmkwhT3Mp',
  REACT_APP_BACK4APP_JS_KEY: process.env.REACT_APP_BACK4APP_JS_KEY || 'pXOr8bbHtjHhov40jDNViXjVbt8ohFbkvwIzHAOk',
  REACT_APP_BACK4APP_URL: process.env.REACT_APP_BACK4APP_URL || 'https://parseapi.back4app.com',
  REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-dxb3uzh2ax774rfe.us.auth0.com',
  REACT_APP_AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID || 'IjxaIWLZ0XWl30ptdzVL0w2tdwzmc8yx'
};
