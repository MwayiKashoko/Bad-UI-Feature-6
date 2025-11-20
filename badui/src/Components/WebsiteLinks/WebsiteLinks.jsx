import React from "react";
import { Link } from "react-router-dom";
//import { useState } from "react";

const WebsiteLinks = () => {
    //const websites = ["Birthday", "Password", "PhoneNumberRange", "BirthdayGuesser", "SecurePassword"];
    const websites = [
        {
            name: "Birthday",
            canLogin: false
        },

        {
            name: "Password",
            canLogin: false
        },

        {
            name: "PhoneNumberRange",
            canLogin: false
        },

        {
            name: "BirthdayGuesser",
            canLogin: false
        },

        {
            name: "SecurePassword",
            canLogin: false
        },
    ]

    return (
        <div>
            <h1>Websites</h1>
            <ul>
                {websites.map((elem) => (
                    <div key={elem.name}>
                        <li >
                            <Link to={"/register"} state={{ ableToLogin: elem.canLogin, uiFeature: elem.name }}>{elem.name}</Link>
                        </li> <br />
                    </div>
                ))}
            </ul>
        </div >
    );
};

export default WebsiteLinks;
