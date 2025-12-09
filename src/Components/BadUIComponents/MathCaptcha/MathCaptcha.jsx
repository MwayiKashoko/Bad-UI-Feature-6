import { useState, useRef, useEffect, useMemo } from "react";
import { setIsAbleToAuthenticate, isAbleToAuthenticate } from "../BadUIComponents";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "../../Auth/Auth.css";

// Utility functions
export const random = (min, max) => {
    return Math.floor((max - min + 1) * Math.random()) + min;
};

// nCk
const combination = (n, k) => {
    let num = 1, den = 1;
    for (let i = 1; i <= k; i++) {
        num *= (n - (i - 1));
        den *= i;
    }
    return num / den;
};

export const expandBinomial = (a, b, n) => {
    const coeffs = [];

    for (let k = 0; k <= n; k++) {
        const binom = combination(n, k); // nCk
        let coef = binom * (a ** (n - k)) * (b ** k);

        const xPower = n - k;
        const yPower = k;

        let term = '';

        // Only add coefficient if it's not 1 or -1 (except if the term is constant)
        const isConstant = xPower === 0 && yPower === 0;
        if ((coef !== 1 && coef !== -1) || isConstant) {
            term += coef;
        } else if (coef === -1) {
            term += '-';
        }

        // x term
        if (xPower === 1) term += 'x';
        else if (xPower > 1) term += `x^${xPower}`;

        // y term
        if (yPower === 1) term += 'y';
        else if (yPower > 1) term += `y^${yPower}`;

        coeffs.push(term);
    }

    return coeffs.join(' + ').replace(/\+\s-/g, '- ');
};

// Checkmark component - shows black checkmark on white background for 2 seconds then resets
const CompletionCheckmark = ({ onReset }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onReset) {
                onReset();
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [onReset]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '40px 20px',
            backgroundColor: '#ffffff',
        }}>
            <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="#000000"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export const SimpleMathQuestion = ({ user }) => {
    const config = useMemo(() => ({
        packages: { "[+]": ["html"] },
        loader: { load: ["input/tex", "output/chtml"] },
        tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
        chtml: {
            linebreaks: { automatic: false }
        }
    }), []);

    const math = require("mathjs");
    /*
    1. Greatest Common divisor
    2. Compute the expansion of polynomial annoyingly
    3. Summations That Reduce to Closed Forms
    4. Determinant of nxn matrix (n is very large)
    */
    const [typeOfEquation, setTypeOfEquation] = useState(random(1, 4));
    const [text, setText] = useState("Could not verify that you are a human.\nPlease solve the following math problem to prove you're not a human");
    const [inputValue, setInputValue] = useState("");
    const [completed, setCompleted] = useState(false);
    const inputRef = useRef();

    // Store equation values in refs so they persist across renders
    const equationDataRef = useRef({ num1: 1, num2: 1, num3: 1, num4: 1, matrixValues: [] });

    const formula = useMemo(() => {
        let num1, num2, num3, num4, matrixValues;
        
        switch (typeOfEquation) {
            case 1:
                num1 = random(10000, 1000000) * 2;
                num2 = random(10000, 1000000) * 2;
                equationDataRef.current = { num1, num2, num3: 0, num4: 0, matrixValues: [] };
                return `\\[gcd(${num1}, ${num2}) = ?\\]`;
            case 2:
                num1 = random(5, 10);
                num2 = random(5, 10);
                num3 = random(5, 10);
                equationDataRef.current = { num1, num2, num3, num4: 0, matrixValues: [] };
                return `Expand \\[(${num1}x+${num2}y)^${num3} \\]`;
            case 3:
                num1 = random(1, 10);
                num2 = random(100, 200);
                num3 = random(10, 100);
                num4 = random(2, 4);
                equationDataRef.current = { num1, num2, num3, num4, matrixValues: [] };
                return `\\[\\sum_{n = ${num1}}^{${num2}}${num3}n^{${num4}}\\]`;
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
                equationDataRef.current = { num1: 0, num2: 0, num3: 0, num4: 0, matrixValues };
                return `\\[ \\det\\!\\begin{pmatrix} ${latexMatrix} \\end{pmatrix} \\]`;
            default:
                return "";
        }
    }, [typeOfEquation]);

    const checkIfMathRight = () => {
        let cond = false;
        const { num1, num2, num3, num4, matrixValues } = equationDataRef.current;
        
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

        return cond;
    }

    const handleReset = () => {
        setCompleted(false);
        setTypeOfEquation(random(1, 4));
        setInputValue("");
        setText("Could not verify that you are a human.\nPlease solve the following math problem to prove you're not a human");
        setIsAbleToAuthenticate(false);
    };

    if (completed) {
        return <CompletionCheckmark onReset={handleReset} />;
    }

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '0 30px',
            alignItems: 'center'
        }}>
            <p style={{
                margin: 0,
                fontSize: '16px',
                textAlign: 'center',
                lineHeight: '1.5',
                whiteSpace: 'pre-line'
            }}>
                {text}
            </p>

            {!isAbleToAuthenticate &&
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    alignItems: 'center',
                }}>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        width: '100%',
                        minWidth: 'fit-content',
                        minHeight: "fit-content",
                        textAlign: 'center',
                        fontFamily: 'helvetica',
                        overflow: 'auto',
                    }}>
                        <MathJaxContext config={config}>
                            <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                                <MathJax inline>{formula}</MathJax>
                            </span>
                        </MathJaxContext>
                    </div>

                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <input
                            ref={inputRef}
                            className="form-input"
                            placeholder="Enter your answer"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                if (checkIfMathRight() || isAbleToAuthenticate) {
                                    setCompleted(true);
                                    setIsAbleToAuthenticate(true);
                                    setText("Success!!! Press signup to login");
                                } else {
                                    setTypeOfEquation(random(1, 4));
                                    setInputValue("");
                                }
                            }}
                            disabled={!inputValue.trim()}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                height: '50px',
                                fontSize: '18px',
                                color: inputValue.trim() ? '#ffffff' : '#999999',
                                border: '3px solid #000000',
                                borderRadius: '10px',
                                backgroundColor: inputValue.trim() ? '#000000' : '#e0e0e0',
                                fontWeight: '700',
                                cursor: inputValue.trim() ? 'pointer' : 'default',
                                transition: 'all 0.3s ease',
                                fontFamily: '"Zen Maru Gothic", sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: inputValue.trim() ? 1 : 0.6
                            }}
                        >
                            Submit Answer
                        </button>
                    </div>
                </div>}
        </div>
    );
}

