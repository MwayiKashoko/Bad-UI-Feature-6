import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setIsAbleToAuthenticate } from "../Scripts/publicVars";

const AuthRegister = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    username: "JohnDoe123",
    firstName: "John",
    lastName: "Doe",
    email: "example@site.com",
    birthday: "2000-12-25",
    phoneNumber: "5551234567",
    password: "password",
  });

  // flag is the state to watch for add/remove updates
  const [add, setAdd] = useState(false);
  const location = useLocation();

  const [ui] = useState({
    ableToLogin: location.state?.ableToLogin ?? true,
    uiFeature: location.state?.uiFeature ?? null,
    alternativeEmail: location.state?.alternativeEmail ?? null,
    alternativePassword: location.state?.alternativePassword ?? null,
    alternativeFirstName: location.state?.alternativeFirstName ?? null,
    alternativeLastName: location.state?.alternativeLastName ?? null,
    alternativeUsername: location.state?.alternativeUsername ?? null,
    alternativeBirthday: location.state?.alternativeBirthday ?? null,
    alternativePhoneNumber: location.state?.alternativePhoneNumber ?? null,
    errorTextEmail: location.state?.errorTextEmail ?? null,
    errorTextPassword: location.state?.errorTextPassword ?? null,
    errorTextUsername: location.state?.errorTextUsername ?? null,
    errorTextBirthday: location.state?.errorTextBirthday ?? null,
    errorTextPhoneNumber: location.state?.errorTextPhoneNumber ?? null,
    captcha: location.state?.captcha ?? null,
  });

  /*const ableToLogin = location.state?.ableToLogin ?? true;
  const uiFeature = location.state?.uiFeature ?? null;
  const alternativeEmail = location.state?.alternativeEmail ?? false;
  const alternativePassword = location.state?.alternativePassword ?? false;
  const alternativeFirstName = location.state?.alternativeFirstName ?? false;
  const alternativeLastName = location.state?.alternativeLastName ?? false;
  const alternativeUsername = location.state?.alternativeUsername ?? false;
  const alternativeBirthday = location.state?.alternativeBirthday ?? false;
  const alternativePhoneNumber = location.state?.alternativePhoneNumber ?? false;
  const captcha = location.state?.captcha ?? null;*/

  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((userCreated) => {
        if (userCreated) {
          navigate("/user");
        }
        setAdd(false);
      });
    }
  }, [newUser, add, navigate]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    //console.log(e.target);
    const { name, value: newValue } = e.target;
    //console.log(newValue);
    setNewUser({ ...newUser, [name]: newValue });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    //console.log("submitted: ", e.target);
    setAdd(true);
  };


  return (
    <div>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        ui={ui}
        isRegister={true}
      />
      {/* BACK BUTTON ADDED FOR IMPROVED USER NAVIGATION EXPERIENCE */}
      {ui.ableToLogin ? <p><Link onClick={() => {
        setIsAbleToAuthenticate(false);
      }} to="/login">Already have an account? Login here.</Link></p> : null}
      <p> <Link onClick={(e) => {
        setIsAbleToAuthenticate(false);
        window.location.href = "/websites";
      }
      } to="/websites">Back to list</Link></p>
    </div>
  );
};

export default AuthRegister;
