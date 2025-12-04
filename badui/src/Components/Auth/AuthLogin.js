//ALL CODE BELOW ADDED (FILE STARTED BLANK)

import React, { useEffect, useState } from "react";
import { loginUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setIsAbleToAuthenticate } from "../Scripts/publicVars.js";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [credentials, setcredentials] = useState({ email: "example@site.com", password: "password" });
  const [doLogin, setDoLogin] = useState(false);

  const location = useLocation();

  const [ui] = useState({
    ableToLogin: location.state?.ableToLogin ?? true,
    uiFeature: location.state?.uiFeature ?? null,
    alternativeEmail: location.state?.alternativeEmail ?? null,
    alternativePassword: location.state?.alternativePassword ?? null,
    errorTextEmail: location.state?.errorTextEmail ?? null,
    errorTextPassword: location.state?.errorTextPassword ?? null,
    captcha: location.state?.captcha ?? null,
  });

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
      <AuthForm
        user={credentials}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        ui={ui}
      />
      {/* BACK BUTTON ADDED FOR IMPROVED USER NAVIGATION EXPERIENCE */}
      <p> <Link onClick={() => {
        setIsAbleToAuthenticate(false);
      }} to="/register">Don't have an account? Create one here.</Link></p>
      <p> <Link onClick={() => {
        setIsAbleToAuthenticate(false);
        window.location.href = "/websites";
      }} to="/websites">Back to list</Link></p>
    </div>
  );
};

export default AuthLogin;
