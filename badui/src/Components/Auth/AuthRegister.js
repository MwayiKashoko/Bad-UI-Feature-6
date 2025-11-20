import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AuthRegister = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    PhoneNumber: "",
    password: "",
  });

  // flag is the state to watch for add/remove updates
  const [add, setAdd] = useState(false);
  const location = useLocation();
  const ableToLogin = location.state?.ableToLogin ?? true;
  const uiFeature = location.state?.uiFeature ?? null;

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
        uiFeature={uiFeature}
        isRegister={true}
      />
      {/* BACK BUTTON ADDED FOR IMPROVED USER NAVIGATION EXPERIENCE */}
      {ableToLogin ? <p><Link to="/login">Already have an account? Login here.</Link></p> : null}
      <p> <Link to="/websites">Back to list</Link></p>
    </div>
  );
};

export default AuthRegister;
