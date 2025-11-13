import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { Link, useNavigate } from "react-router-dom";

const AuthRegister = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // flag is the state to watch for add/remove updates
  const [add, setAdd] = useState(false);

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
    console.log(e.target);
    const { name, value: newValue } = e.target;
    console.log(newValue);
    setNewUser({ ...newUser, [name]: newValue });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("submitted: ", e.target);
    setAdd(true);
  };

  
  return (
    <div>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        isRegister={true}
      />
      {/* BACK BUTTON ADDED FOR IMPROVED USER NAVIGATION EXPERIENCE */}
      <p><Link to="/login">Already have an account? Login here.</Link></p>
    </div>
  );
};

export default AuthRegister;
