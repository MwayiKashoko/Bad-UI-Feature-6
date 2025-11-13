//FILE CODE ADDED BELOW
import React from "react"; //FROM LECTURE 17 CODE EXAMPLE
import { Navigate } from "react-router-dom"; //FROM LECTURE 17 CODE EXAMPLE

const ProtectedRoute = ({ element: Component, isAuthed }) => {
  if (isAuthed) return <Component />; //BASED ON HINT FROM LECTURE 17 CODE EXAMPLE

  return <Navigate to="/auth" replace />; //LINE ADDED TO REDIRECT TO /auth WHEN NOT AUTHENTICATED
};

export default ProtectedRoute; //FROM LECTURE 17 CODE EXAMPLE

