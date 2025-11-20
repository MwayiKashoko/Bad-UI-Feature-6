import { /*random, isPasswordGood*/ } from "./publicVars.js";

let formDiv;
let extraDiv;
let emailInput;
let usernameInput;
let passwordInput;
let birthdayInput;
let phoneNumberInput;
let errorTextEmail;
let errorTextUsername;
let errorTextPassword;
let errorTextBirthday;
let errorTextPhoneNumber;
let signupButton;
let captcha;

let extraDivVisible = "hidden";
let formDivVisible = "visible";

const setVars = () => {
    formDiv = document.getElementById("formDiv");
    extraDiv = document.getElementById("extraDiv");
    emailInput = document.getElementById("emailInput");
    usernameInput = document.getElementById("usernameInput");
    passwordInput = document.getElementById("passwordInput");
    birthdayInput = document.getElementById("birthdayInput");
    phoneNumberInput = document.getElementById("phoneNumberInput");
    errorTextEmail = document.getElementById("errorTextEmail");
    errorTextUsername = document.getElementById("errorTextUsername");
    errorTextPassword = document.getElementById("errorTextPassword");
    errorTextBirthday = document.getElementById("errorTextBirthday");
    errorTextPhoneNumber = document.getElementById("errorTextPhoneNumber");
    signupButton = document.getElementById("signUpButton");
    captcha = document.getElementById("captcha");
}

const checkIfCanLogin = () => {
    return emailInput.value.trim() !== "" && passwordInput.value.trim() !== "";
}

const checkIfCanRegister = () => {
    return emailInput.value.trim() !== "" && passwordInput.value.trim() !== "" && usernameInput.value.trim() !== "" && birthdayInput.value.trim() !== "" && phoneNumberInput.value.trim() !== "";
}

let earliestDate = new Date(1900, 0, 1);
let latestDate = new Date();
//let currentDate = null;

const generateRandomDate = () => {
    let date = new Date(
        earliestDate.getTime() +
        Math.random() * (latestDate.getTime() - earliestDate.getTime())
    );

    //currentDate = date;
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};


const reset = (makeVisible = true) => {
    errorTextEmail.innerText = "";
    errorTextPassword.innerText = "";

    try {
        errorTextUsername.innerText = "";
        errorTextBirthday.innerText = "";
        errorTextPhoneNumber.innerText = "";
        captcha.innerText = "";
        captcha.innerHTML = "";
    } catch (e) {

    }

    earliestDate = new Date(1900, 0, 1);
    latestDate = new Date();
    //currentDate = null;

    if (makeVisible) {
        formDivVisible = "visible";
        extraDivVisible = "hidden";
        extraDiv.innerHTML = "";
    }
};

const birthdayFunc = () => {
    errorTextBirthday.innerText =
        "ERROR: Birthday already in use. Please choose another";
};

const passwordInUse = () => {
    errorTextPassword.innerText =
        " ERROR: Password already in use for this username";
};

const setExtraDiv = () => {
    formDiv = "hidden";
    extraDivVisible = "visible";
};

const makePhoneNumberRange = () => {
    setExtraDiv();
    extraDiv.innerHTML = `<label>Enter Phone Number: <input id="badPhoneNumber" onchange="document.getElementById('mySpan').innerText=\`+(\${this.value.substring(0, 2)}) \${this.value.substring(2, 5)}-\${this.value.substring(5, 8)}-\${this.value.substring(8, 12)}\`" min="100000000000" max="999999999999" type='range'/></label> <span id="mySpan">+(10) 000-000-0000</span>`;
};

const guessBirthday = () => {
    setExtraDiv();
    extraDiv.innerHTML = `
      <button id="earlier" onclick="latestDate=currentDate; birthday.innerText=generateRandomDate();">Earlier</button>
      <span>Is this your birthday?</span>
      <span id="birthday">${generateRandomDate()}</span>
      <button id="later" onclick="earliestDate=currentDate; birthday.innerText=generateRandomDate();">Later</button>
    `;
};

const securePassword = () => {
    setExtraDiv();

    extraDiv.innerHTML = `
      <label>Enter Password: <input oninput="(() => {
          isPasswordGood(this.value);
        })();
      " id="securePassword"/></label>
    `;
};

export const signupButtonOnClick = (option, isRegister) => {
    setVars();
    reset(!extraDivVisible === "visible");

    let isAbleToAuthenticate = false;

    if ((isRegister && checkIfCanRegister()) || (!isRegister && checkIfCanLogin())) {
        switch (option) {
            case "Birthday":
                birthdayFunc();
                break;
            case "Password":
                passwordInUse();
                break;
            default:
                break;
        }
    }

    return [formDivVisible, extraDivVisible, isAbleToAuthenticate];
};
