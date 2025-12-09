import React from "react";
import { Link } from "react-router-dom";
import * as badUI from "../BadUIComponents/BadUIComponents"
import { setIsAbleToAuthenticate } from "../Scripts/publicVars";
//import { useState } from "react";

const WebsiteLinks = () => {
    //const websites = ["Birthday", "Password", "PhoneNumberRange", "BirthdayGuesser", "SecurePassword"];
    const websites = [
        //Birthday
        {
            name: "Birthday",
            canLogin: false,
            alternativeFirstName: true,
            alternativeLastName: true,
            alternativeUsername: true,
            alternativePhoneNumber: true,
            errorTextBirthday: true
        },
        //Password
        {
            name: "Password",
            canLogin: false,
            errorTextPassword: true
        },
        //PhoneNumberRange
        {
            name: "PhoneNumberRange",
            alternativeFirstName: true,
            alternativeLastName: true,
            alternativeUsername: true,
            alternativeBirthday: true,
            alternativePhoneNumber: true,
            canLogin: false
        },
        //BirthdayGuesser
        {
            name: "BirthdayGuesser",
            alternativeFirstName: true,
            alternativeLastName: true,
            alternativeUsername: true,
            alternativePhoneNumber: true,
            alternativeBirthday: true,
            errorTextBirthday: true,
            canLogin: false
        },
        //SecurePassword
        {
            name: "SecurePassword",
            errorTextPassword: true,
            canLogin: false
        },
        //MathCAPTCH
        {
            name: "Math CAPTCHA",
            captcha: true,
            canLogin: true
        },
        //GuessTheNumber
        {
            name: "GuessTheNumber",
            captcha: true,
            canLogin: true
        },

        {
            name: "TetrisMasterMode",
            captcha: true,
            canLogin: true
        },

        {
            name: "TetrisInvisibleMode",
            captcha: true,
            canLogin: true
        },

        {
            name: "TetrisSprint",
            captcha: true,
            canLogin: true
        },

        {
            name: "TetrisFast",
            captcha: true,
            canLogin: true
        },

        {
            name: "TetrisMarathon",
            captcha: true,
            canLogin: true
        },

        {
            name: "AlertEverySuccessfulOperation",
            alternativeBirthday: true,
            canLogin: true
        },

        {
            name: "CompleteEasyMarioLevel",
            captcha: true,
            canLogin: true
        },

        {
            name: "EasyPianoPieces",
            captcha: true,
            canLogin: true
        },
    ]

    return (
        <div>
            <h1>Websites</h1>
            <ul>
                {websites.map((elem) => (
                    <div key={elem.name}>
                        <li >
                            <Link onClick={() => {
                                setIsAbleToAuthenticate(false);
                            }
                            } to={"/register"} state={{
                                ableToLogin: elem.canLogin,
                                uiFeature: elem.name,
                                alternativeEmail: elem.alternativeEmail,
                                alternativePassword: elem.alternativePassword,
                                alternativeFirstName: elem.alternativeFirstName,
                                alternativeLastName: elem.alternativeLastName,
                                alternativeUsername: elem.alternativeUsername,
                                alternativeBirthday: elem.alternativeBirthday,
                                alternativePhoneNumber: elem.alternativePhoneNumber,
                                errorTextEmail: elem.errorTextEmail,
                                errorTextPassword: elem.errorTextPassword,
                                errorTextUsername: elem.errorTextUsername,
                                errorTextBirthday: elem.errorTextBirthday,
                                errorTextPhoneNumber: elem.errorTextPhoneNumber,
                                captcha: elem.captcha
                            }}>{elem.name.match(/[A-Z][a-z]+/g).join(" ")}</Link>
                        </li> <br />
                    </div>
                ))}
            </ul>
        </div >
    );
};

export default WebsiteLinks;
