//ALL CODE BELOW ADDED (SAME AS LECTURE 17 CODE EXAMPLE "MAINGOOD.JS")


import React from "react";
import { useNavigate } from "react-router-dom"; //LINE ADDED
import { logoutUser } from "../Auth/AuthService"; //LINE ADDED
import { useAuth0 } from "@auth0/auth0-react";
import Parse from "parse"; //LINE ADDED TO GET CURRENT USER

const MainGood = () => {
  const navigate = useNavigate(); //LINE ADDED
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout, user: auth0User } = useAuth0();
  const currentUser = Parse.User.current(); //LINE ADDED TO GET LOGGED IN USER
  const userName = currentUser
    ? `${currentUser.get("firstName")} ${currentUser.get("lastName")}`
    : auth0User?.name || auth0User?.email || "Guest"; //LINE ADDED TO DISPLAY USER NAME DYNAMICALLY

  return (
    <div>
      <h1>User: {userName}</h1>

      {/*LOGOUT BUTTON ADDED*/}
      <button
        onClick={async () => {
          if (isAuth0Authenticated) {
            auth0Logout({ logoutParams: { returnTo: window.location.origin } });
          } else {
            await logoutUser();
            navigate("/login");
          }
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default MainGood;
