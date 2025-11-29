import { useState, useRef } from "react"
import { generateRandomDate, generateRandomDateObject } from "../Scripts/BadUIScripts";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { random, expandBinomial } from "../Scripts/publicVars";
import * as math from "mathjs";

export const BirthdayNeverAvailable = () => {
    return <span> ERROR: Birthday already in use. Please choose another</span>
}

export const PasswordAlreadyInUse = () => {
    return <span> ERROR: Password already in use for this email</span>
}

export const PhoneNumberRange = ({ user }) => {
    const [phoneNumber, setPhoneNumber] = useState("+(10) 000-000-0000");

    const handleChange = (e) => {
        const val = e.target.value;
        const formatted = `+(${val.substring(0, 2)}) ${val.substring(2, 5)}-${val.substring(5, 8)}-${val.substring(8, 12)}`;
        setPhoneNumber(formatted);
    };

    user.isAbleToAuthenticate = true;

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
    } else {
        user.isAbleToAuthenticate = true;
    }

    let failed = error.length !== "";

    return <span>{error}</span>
}

export const SimpleMathQuestion = ({ user }) => {
    const config = {
        packages: { "[+]": ["html"] },
        loader: { load: ["input/tex", "output/chtml"] },
        tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] }
    };

    let num1 = 1;
    let num2 = 1;
    let num3 = 1;
    let num4 = 1;
    let matrixValues = [];
    /*
    1. Greatest Common divisor
    2. Compute the expansion of polynomial annoyingly
    3. Summations That Reduce to Closed Forms
    4. Determinant of nxn matrix (n is very large)
    */
    const [typeOfEquation, setTypeOfEquation] = useState(random(1, 4));
    const [text, setText] = useState("Could not verify that you are a human. Please solve the following simple math equation:");
    const [numSolvedEquations, setNumSolvedEquations] = useState(0);
    const inputRef = useRef();
    let formula = "";

    switch (typeOfEquation) {
        case 1:
            num1 = random(10000, 1000000) * 2;
            num2 = random(10000, 1000000) * 2;
            formula = `\\[gcd(${num1}, ${num2}) = ?\\]`;
            console.log(math.gcd(num1, num2));
            break;
        case 2:
            num1 = random(5, 10);
            num2 = random(5, 10);
            num3 = random(5, 10);
            formula = `Expand \\[(${num1}x+${num2}y)^${num3} \\]`;
            console.log(expandBinomial(num1, num2, num3));
            break;
        case 3:
            num1 = random(1, 10);
            num2 = random(100, 200);
            num3 = random(10, 100);
            num4 = random(2, 4);

            formula = `\\[\\sum_{n = ${num1}}^{${num2}}${num3}n^{${num4}}\\]`;

            let actualAnswer = 0;

            for (let i = num1; i <= num2; i++) {
                actualAnswer += num3 * i ** num4;
            }

            console.log(actualAnswer);

            break;
        case 4:
            num1 = random(4, 5);
            matrixValues = [];

            for (let i = 0; i < num1; i++) {
                matrixValues.push([]);
                for (let j = 0; j < num1; j++) {
                    matrixValues[i].push(random(1, 100));
                }
            }

            const latexMatrix = matrixValues
                .map(row => row.join(' & '))
                .join(' \\\\ ');

            formula = `\\[ \\det\\!\\begin{pmatrix} ${latexMatrix} \\end{pmatrix} \\]`;
            console.log(math.det(matrixValues));
            break;
        default:
            break;
    }

    const checkIfMathRight = () => {
        let cond = false;
        switch (typeOfEquation) {
            case 1:
                cond = parseInt(inputRef.current.value) === math.gcd(num1, num2);
                break;
            case 2:
                cond = inputRef.current.value.replaceAll(" ", "") === expandBinomial(num1, num2, num3).replaceAll(" ", "");
                break;
            case 3:
                let actualAnswer = 0;

                for (let i = num1; i <= num2; i++) {
                    actualAnswer += num3 * i ** num4;
                }

                cond = parseInt(inputRef.current.value) === actualAnswer;
                break;
            case 4:
                cond = parseInt(inputRef.current.value) === math.det(matrixValues);
                break;
            default:
                break;
        }

        if (cond) {
            console.log("CORRRECT");
        } else {
            console.log("NOPE");
        }

        return cond;
    }

    return (
        <span>
            {text}
            <MathJaxContext config={config}>
                <MathJax inline>{formula}</MathJax>
            </MathJaxContext>

            <input ref={inputRef} /> <button onClick={() => {
                if (checkIfMathRight() || user.isAbleToAuthenticate) {
                    setNumSolvedEquations(numSolvedEquations + 1);
                } else {
                    setNumSolvedEquations(0);
                }

                setTypeOfEquation(random(1, 4));

                if (numSolvedEquations === 3) {
                    user.isAbleToAuthenticate = true;
                    formula = ``;
                    setText("Success!!! Press signup to login");
                } else {
                    setText("Please try again and solve this equation:");
                }
            }}>Submit Answer</button> <br /> <br />
        </span>
    );
}