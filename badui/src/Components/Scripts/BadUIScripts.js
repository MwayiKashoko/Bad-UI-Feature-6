import { /*random, isPasswordGood*/ } from "./publicVars.js";

let emailInput;
let usernameInput;
let passwordInput;
let birthdayInput;
let phoneNumberInput;

const setVars = () => {
    emailInput = document.getElementById("emailInput");
    usernameInput = document.getElementById("usernameInput");
    passwordInput = document.getElementById("passwordInput");
    birthdayInput = document.getElementById("birthdayInput");
    phoneNumberInput = document.getElementById("phoneNumberInput");
}

const checkIfCanLogin = () => {
    return emailInput.value.trim() !== "" && passwordInput.value.trim() !== "";
}

const checkIfCanRegister = () => {
    const fields = [
        emailInput,
        passwordInput,
        usernameInput,
        birthdayInput,
        phoneNumberInput
    ];

    return fields
        .filter(f => f)                     // keep only non-null inputs
        .every(f => f.value.trim() !== ""); // all must be non-empty
}

export const generateRandomDateObject = (earliestDate, latestDate) => {
    return new Date(
        earliestDate.getTime() +
        Math.random() * (latestDate.getTime() - earliestDate.getTime())
    );
}

export const generateRandomDate = (earliestDate, latestDate) => {
    let date = new Date(
        earliestDate.getTime() +
        Math.random() * (latestDate.getTime() - earliestDate.getTime())
    );

    //currentDate = date;
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export const signupButtonOnClick = (option, isRegister) => {
    setVars();

    let isAbleToAuthenticate = false;

    if ((isRegister && checkIfCanRegister()) || (!isRegister && checkIfCanLogin())) {
        //Basically have two swithces for option so I can set the isAbleToAuthenticate flag to true or false
        switch (option) {
            case "Birthday":
                break;
            case "Password":
                break;
            case "SecurePassword":
                break;
            case "SimpleMathQuestions":
                break;
            default:
                isAbleToAuthenticate = true;
                break;
        }
    }

    return isAbleToAuthenticate;
};
