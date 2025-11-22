import React, { useState, useEffect } from "react";
import { signupButtonOnClick } from "../Scripts/BadUIScripts";
import setAllUI from "../BadUIComponents/BadUIArrs";

const AuthForm = ({ user, onChange, onSubmit, isRegister = false, ui }) => {
  const [isAbleToAuthenticate, setIsAbleToAuthenticate] = useState(false);
  const [clickedButton, setClickedButton] = useState(false);
  const [allElements, setAllElements] = useState({
    UiErrorEmail: null,
    UiErrorPassword: null,
    UiErrorUsername: null,
    UiErrorBirthday: null,
    UiErrorPhoneNumber: null,
    Captcha: null,
    AlternativeEmail: null,
    AlternativePassword: null,
    AlternativeFirstName: null,
    AlternativeLastName: null,
    AlternativeUsername: null,
    AlternativeBirthday: null,
    AlternativePhoneNumber: null,
  });

  useEffect(() => {
    const updatedElements = setAllUI(ui.uiFeature);
    setAllElements(updatedElements);
  }, [ui.uiFeature]);


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
        {!ui.alternativeEmail ?
          <>
            <label>Email: <input type="email" value={user.email} onChange={onChange} name="email" id="emailInput" required />
              <span className="error" id="errorTextEmail"> {clickedButton && ui.errorTextEmail && allElements.UiErrorEmail && <allElements.UiErrorEmail user={user} />} </span></label><br />
            <br />
          </> : allElements.AlternativeEmail && <allElements.AlternativeEmail value={user.email} onChange={onChange} name="email" id="emailInput" required />}

        {!ui.alternativePassword ?
          <>
            <label>Password: <input value={user.password} size={Math.max(user.password.length + 1, 20)} onChange={onChange} name="password" required id="passwordInput" />
              <span className="error" id="errorTextPassword"> {clickedButton && ui.errorTextPassword && allElements.UiErrorPassword && <allElements.UiErrorPassword user={user} />} </span></label>
            <br />
            <br />
          </> : allElements.AlternativePassword && <allElements.AlternativePassword value={user.email} onChange={onChange} name="email" id="emailInput" required />}

        {isRegister ?
          <>
            {!ui.alternativeFirstName ?
              <>
                <label>First Name: </label>
                <input type="text" value={user.firstName} onChange={onChange} name="firstName" required />
                <br /> <br />
              </> : allElements.AlternativeFirstName && <allElements.AlternativeFirstName value={user.email} onChange={onChange} name="email" id="emailInput" required />}

            {!ui.alternativeLastName ?
              <>
                <label>Last Name: </label>
                <input type="text" value={user.lastName} onChange={onChange} name="lastName" required />
                <br /><br />
              </> : allElements.AlternativeLastName && <allElements.AlternativeLastName value={user.email} onChange={onChange} name="email" id="emailInput" required />}

            {!ui.alternativeUsername ?
              <>
                <label>Username: <input type="text" value={user.username} onChange={onChange} name="username" required id="usernameInput" />
                  <span className="error" id="errorTextUsername"> {clickedButton && ui.errorTextUsername && allElements.UiErrorUsername && <allElements.UiErrorUsername user={user} />} </span></label>
                <br />
                <br />
              </> : allElements.AlternativeUsername && <allElements.AlternativeUsername value={user.email} onChange={onChange} name="email" id="emailInput" required />}

            {!ui.alternativeBirthday ?
              <>
                <label>Birthday: <input value={user.birthday} onChange={onChange} name="birthday" required id="birthdayInput" type="date" />
                  <span className="error" id="errorTextBirthday"> {clickedButton && ui.errorTextBirthday && allElements.UiErrorBirthday && <allElements.UiErrorBirthday user={user} />} </span></label>
                <br />
                <br />
              </> : allElements.AlternativeBirthday && <allElements.AlternativeBirthday value={user.email} onChange={onChange} name="email" id="emailInput" required />}

            {!ui.alternativePhoneNumber ?
              <>
                <label>Phone Number: <input value={user.phoneNumber} onChange={onChange} name="phoneNumber" required type="number" id="phoneNumberInput" />
                  <span className="error" id="errorTextPhoneNumber"> {clickedButton && ui.errorTextPhoneNumber && allElements.UiErrorPhoneNumber && <allElements.UiErrorPhoneNumber user={user} />} </span></label>
                <br />
                <br />
              </> : allElements.AlternativePhoneNumber && <allElements.AlternativePhoneNumber value={user.email} onChange={onChange} name="email" id="emailInput" required />}

            <div id="captcha">{clickedButton && ui.captcha && allElements.Captcha && <allElements.Captcha />}</div>
          </>
          : null}

        <button id="signUpButton" type="submit" onClick={() => {
          const setVars = signupButtonOnClick(ui.uiFeature, isRegister);
          setIsAbleToAuthenticate(setVars[0]);
          setClickedButton(true);
        }}>{isRegister ? "Sign Up" : "Login"}</button>
      </form >
    </div >
  );
};

export default AuthForm;
