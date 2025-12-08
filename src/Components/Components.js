import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react"; //LINE ADDED FOR DYNAMIC AUTH CHECK
import { useAuth0 } from "@auth0/auth0-react";
import AuthRegister from "./Auth/AuthRegister.js";
import AuthLogin from "./Auth/AuthLogin.js"; //LINE ADDED
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.js"; //LINE ADDED
import PublicRoute from "./PublicRoute/PublicRoute.js"; //LINE ADDED TO STOP AUTHENTICATED USERS FROM ACCESSING PUBLIC ROUTES
import Main from "./Main/MainGood.js";
import Home from "./Home/Home.js"; //LINE ADDED FOR HOME PAGE
import { isAuthenticated } from "./Auth/AuthService.js"; //LINE ADDED

//COMPONENT TO WRAP ROUTES AND PROVIDE DYNAMIC AUTH CHECK
const AuthRoutes = () => {
  const location = useLocation(); //LINE ADDED TO TRACK ROUTE CHANGES
  const { isAuthenticated: isAuth0Authenticated } = useAuth0();
  const [authorized, setAuthorized] = useState(() => 
    isAuthenticated() || isAuth0Authenticated
  ); //LINE ADDED FOR DYNAMIC STATE WITH INITIAL CHECK

  //EFFECT TO RE-CHECK AUTHENTICATION WHEN ROUTE CHANGES OR COMPONENT MOUNTS
  useEffect(() => {
    setAuthorized(isAuthenticated() || isAuth0Authenticated); //LINE ADDED TO UPDATE AUTH STATUS DYNAMICALLY
  }, [location, isAuth0Authenticated]); //LINE ADDED TO RE-CHECK ON ROUTE NAVIGATION

  return (
    <Routes>
      {/*HOME PAGE - ACCESSIBLE TO EVERYONE*/}
      <Route path="/" element={<Home />} />
      {/*REDIRECT /auth TO /login*/}
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      {/*PUBLIC ROUTES THAT SHOULD NOT BE ACCESSIBLE WHEN LOGGED IN LIKE INSTRUCTIONS SAY TO DO*/}
      <Route
        path="/register"
        element={<PublicRoute element={AuthRegister} isAuthed={authorized} />}
      />
      <Route
        path="/login"
        element={<PublicRoute element={AuthLogin} isAuthed={authorized} />}
      />
      {/*PROTECTED ROUTE THAT REQUIRES AUTHENTICATION*/}
      <Route
        path="/user"
        element={<ProtectedRoute element={Main} isAuthed={authorized} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const Components = () => {
  return (
    //CODE ADDED BELLOW BASED ON LECTURE 17 CODE EXAMPLE
    <Router>
      <AuthRoutes /> {/*LINE ADDED TO USE DYNAMIC AUTH CHECK WRAPPER*/}
    </Router>
  );
};

export default Components;
