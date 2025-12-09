//FILE CODE ADDED BELOW
import React from "react"; //FROM LECTURE 17 CODE EXAMPLE
import { Navigate } from "react-router-dom"; //FROM LECTURE 17 CODE EXAMPLE

//COMPONENT TO PROTECT PUBLIC ROUTES FROM AUTHENTICATED USERS
const PublicRoute = ({ element: Component, isAuthed }) => {
  //IF USER IS AUTHENTICATED, REDIRECT TO USER DASHBOARD
  if (isAuthed) return <Navigate to="/user" replace />;
  return <Component />;
};

export default PublicRoute;
