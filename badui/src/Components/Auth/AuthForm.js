import React from "react";
import { useState } from "react";
import { signupButtonOnClick } from "../Scripts/BadUI";

const AuthForm = ({ user, onChange, onSubmit, isRegister = false, uiFeature }) => {
  const [formDivVisible, setFormDivVisible] = useState(false);
  const [extraDivVisible, setExtraDivVisible] = useState(false);
  const [isAbleToAuthenticate, setIsAbleToAuthenticate] = useState(false);

  return (
    <div>
      <br />

      <form onSubmit={(e) => {
        e.preventDefault(); // prevent default browser submission
        if (isAbleToAuthenticate) {
          onSubmit(e);
          return;
        }
      }}>
        <label>Email: <input type="email" value={user.email} onChange={onChange} name="email" id="emailInput" required />
          <span className="error" id="errorTextEmail"></span></label><br />
        <br />

        <label>Password: <input value={user.password} onChange={onChange} name="password" required id="passwordInput" />
          <span className="error" id="errorTextPassword"></span></label>
        <br />
        <br />

        {isRegister ?
          <>
            <div>
              <label>First Name: </label>
              <input type="text" value={user.firstName} onChange={onChange} name="firstName" required />
            </div> <br />
            <div>
              <label>Last Name: </label>
              <input type="text" value={user.lastName} onChange={onChange} name="lastName" required />
            </div> <br />

            <div id="extraDiv" style={{ visible: extraDivVisible }}></div>
            <div id="formDiv" style={{ visible: formDivVisible }}>
              <label>Username: <input type="text" value={user.username} onChange={onChange} name="username" required id="usernameInput" />
                <span className="error" id="errorTextUsername"></span></label>
              <br />
              <br />
              <label>Birthday: <input value={user.birthday} onChange={onChange} name="birthday" required id="birthdayInput" type="date" />
                <span className="error" id="errorTextBirthday"></span></label>
              <br />
              <br />
              <label>Phone Number: <input value={user.phoneNumber} onChange={onChange} name="phoneNumber" required type="number" id="phoneNumberInput" />
                <span className="error" id="errorTextPhoneNumber"></span></label>
              <br />
              <br />

              <span id="captcha"></span>
            </div>
          </>
          : null}

        <button id="signUpButton" type="submit" onClick={() => {
          const setVars = signupButtonOnClick(uiFeature, isRegister);
          setFormDivVisible(setVars[0]);
          setExtraDivVisible(setVars[1]);
          setIsAbleToAuthenticate(setVars[2]);
        }}>{isRegister ? "Sign Up" : "Login"}</button>
      </form >
    </div >
  );
};

export default AuthForm;
