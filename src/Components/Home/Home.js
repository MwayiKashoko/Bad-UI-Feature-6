import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../Auth/AuthService.js";
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout, user: auth0User } = useAuth0();
  const isLoggedIn = isAuthenticated() || isAuth0Authenticated;
  const currentUser = Parse.User.current();
  const firstName = currentUser 
    ? currentUser.get("firstName") 
    : (auth0User?.given_name || auth0User?.name?.split(' ')[0] || null);

  const handleLogout = async () => {
    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      await logoutUser();
      navigate("/");
    }
  };

  return (
    <>
      <div className="home-welcome-container">
        {!isLoggedIn ? (
          <h1 className="home-welcome-text">Welcome to the home of Bad UI</h1>
        ) : (
          <h1 className="home-welcome-text">
            {firstName}, let's build some bad UI
          </h1>
        )}
      </div>
      {!isLoggedIn && (
        <div className="home-auth-container">
          <Link to="/login" className="home-link">
            <button className="home-button">
              Login
            </button>
          </Link>
          <Link to="/register" className="home-link">
            <button className="home-button">
              Sign Up
            </button>
          </Link>
        </div>
      )}
      {isLoggedIn && (
        <div className="home-auth-container">
          <button className="home-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      <div className="home-grid-container">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="home-grid-box"></div>
        ))}
      </div>
    </>
  );
};

export default Home;

