//ALL CODE BELOW ADDED (FILE STARTED BLANK)

import React, { useEffect, useState } from "react";
import { loginUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";
import { useNavigate, Link } from "react-router-dom";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [credentials, setcredentials] = useState({ email: "", password: "" });
  const [doLogin, setDoLogin] = useState(false);

  useEffect(() => {
    if (doLogin) {
      loginUser(credentials.email, credentials.password).then((user) => {
        if (user) {
          navigate("/user");
        }
        setDoLogin(false);
      });
    }
  }, [doLogin, credentials, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setcredentials((s) => ({ ...s, [name]: value }));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setDoLogin(true);
  };

  return (
    <div>
      <AuthForm user={credentials}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
      {/* BACK BUTTON ADDED FOR IMPROVED USER NAVIGATION EXPERIENCE */}
      <p> <Link to="/register">Don't have an account? Create one here.</Link></p>
    </div>
  );
};

export default AuthLogin;
