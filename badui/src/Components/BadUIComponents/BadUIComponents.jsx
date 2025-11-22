import { useState } from "react"
import { generateRandomDate, generateRandomDateObject } from "../Scripts/BadUIScripts";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { random } from "../Scripts/publicVars";

export const BirthdayNeverAvailable = () => {
    return <span> ERROR: Birthday already in use. Please choose another</span>
}

export const PasswordAlreadyInUse = () => {
    return <span> ERROR: Password already in use for this email</span>
}

export const PhoneNumberRange = () => {
    const [phoneNumber, setPhoneNumber] = useState("+(10) 000-000-0000");

    const handleChange = (e) => {
        const val = e.target.value;
        const formatted = `+(${val.substring(0, 2)}) ${val.substring(2, 5)}-${val.substring(5, 8)}-${val.substring(8, 12)}`;
        setPhoneNumber(formatted);
    };

    return (
        <span>
            <label>Enter Phone Number: <input onChange={handleChange} min="100000000000" max="999999999999" type='range' /></label> {phoneNumber}
            <br /> <br />
        </span>);
}

export const BirthdayGuesser = () => {
    const [earliestDate, setEarliestDate] = useState(new Date(1900, 1, 1));
    const [latestDate, setLatestDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(generateRandomDateObject(earliestDate, latestDate));

    const handleEarlier = () => {
        const newLatest = currentDate;
        setLatestDate(newLatest);
        setCurrentDate(generateRandomDateObject(earliestDate, newLatest));
    }

    const handleLater = () => {
        const newEarliest = currentDate;
        setEarliestDate(newEarliest);
        setCurrentDate(generateRandomDateObject(newEarliest, latestDate));
    }

    return (
        <span>
            <button onClick={handleEarlier}>Earlier</button> Is this your birthday? {currentDate.toLocaleDateString()} <button
                onClick={handleLater}
            >Later</button> <br /> <br />
        </span>
    );
}

export const ImpossiblePassword = ({ user }) => {
    let error = "";
    const config = {
        packages: { "[+]": ["html"] },
        loader: { load: ["input/tex", "output/chtml"] },
        tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] }
    };

    if (user.password.length <= 9) {
        error = "Password must be longer than 9 characters.";
    } else if (!/[A-Z]/.test(user.password)) {
        error = "Password must include an uppercase character.";
    } else if (!/[0-9]/.test(user.password)) {
        error = "Password must include a number.";
    } else if (!/[`~!@#$%^&*()\-=_+[\]{}\\|;':",./<>?]/.test(user.password)) {
        error = "Password must include a special character.";
    } else if (!/\$.*?\$.*\$.*\$.*\$.*/.test(user.password)) {
        error = "Password must contain the $ character at least 5 times";
    } else if (!/Agartha/.test(user.password)) {
        error = "Password must contain the phrase Agartha (For Yakub)";
    } else if (!/none|atonal/.test(user.password)) {
        error = <>
            Password must include the key signature of this piece of music <a target="blank" href="https://www.youtube.com/watch?v=kw-YSlUQvgw">link</a>
        </>
    } else if (!/pi\^2\/6/.test(user.password)) {
        error = <span>
            Password must include the solution to this math equation:
            <MathJaxContext config={config}>
                <MathJax inline>{`\\[\\sum_{n = 1}^{\\infty}\\left(\\frac{1}{n^2}\\right)\\]`}</MathJax>
            </MathJaxContext>
        </span>
    } else if (!/green/.test(user.password)) {
        error = "Password must include my favorite color";
    } else if (!/Liszt/.test(user.password)) {
        error = "A jelszónak tartalmaznia kell a leghíresebb magyar zeneszerzőt";
    } else if (!/J1407b/.test(user.password)) {
        error = "Password must include the planet in the Milky Way with the most rings";
    } else if (!/Baltimore/.test(user.password)) {
        error = <>Password must include where this barber is from: <a href="https://www.youtube.com/watch?v=KySQVFGKJTU" target="blank">link</a></>
    }

    let failed = error.length !== "";

    return <span>{error}</span>
}

export const SimpleMathQuestion = () => {
    const config = {
        packages: { "[+]": ["html"] },
        loader: { load: ["input/tex", "output/chtml"] },
        tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] }
    };

    const [randomNum, setRandomNum] = useState(random(3, 100));

    return (
        <span>
            Could not verify that you are a human. Please solve the following simple math equation:
            <MathJaxContext config={config}>
                <MathJax inline>{`\\[\\int_{}^{}\\left(\\frac{dx}{x^{${randomNum}}+1}\\right)\\]`}</MathJax>
            </MathJaxContext>

            <input /> <br /> <br />
        </span>
    );
}