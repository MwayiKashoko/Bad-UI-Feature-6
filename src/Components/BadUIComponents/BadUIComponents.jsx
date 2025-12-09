import { useState, useRef, useEffect } from "react"
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { tetrisCode } from "./Tetris/Tetris";
import { marioCode } from "./Mario/Mario";
import { preloadAssets } from "./Mario/preloadAssets";
import React from "react";
import "../Auth/Auth.css";
import { PhoneNumberRange } from "./PhoneInput/PhoneInput";
import { BirthdayGuesser } from "./BirthdayInput/BirthdayInput";
import { SimpleMathQuestion } from "./MathCaptcha/MathCaptcha";
import { GuessTheNumber } from "./NumberGuessCaptcha/NumberGuessCaptcha";
import { PianoPieces } from "./PianoCaptcha/PianoCaptcha";

// Authentication state management (moved from Scripts/BadUIScripts.js)
export let isAbleToAuthenticate = false;

export const setIsAbleToAuthenticate = (val) => {
    isAbleToAuthenticate = val;
}

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

export const signupButtonOnClick = (isRegister) => {
    setVars();

    if ((!isRegister || !checkIfCanRegister()) && (isRegister || !checkIfCanLogin())) {
        setIsAbleToAuthenticate(false);
    }
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

// Utility functions
export const random = (min, max) => {
    return Math.floor((max - min + 1) * Math.random()) + min;
};

/**
 * Utility function to convert component names to user-friendly display names
 * Centralizes the mapping logic to avoid duplication across components
 * 
 * This mapping ensures consistent naming across the application:
 * - Home page grid displays
 * - Bad UI page titles
 * - Navigation and routing
 * 
 * @param {string} componentName - The internal component name (e.g., "BirthdayGuesser")
 * @returns {string} - User-friendly display name (e.g., "Birthday Input")
 */
export const getComponentDisplayName = (componentName) => {
  // Map internal component names to user-friendly display names
  // These names appear in the UI and should be clear and descriptive
  const nameMap = {
    "BirthdayGuesser": "Birthday Input",
    "PhoneNumberRange": "Phone Input",
    "MathCAPTCH": "Math CAPTCHA",
    "GuessTheNumber": "Number Guesser CAPTCHA",
    "TetrisMasterMode": "Tetris CAPTCHA (Master)",
    "TetrisInvisibleMode": "Tetris CAPTCHA (Invisible)",
    "TetrisSprint": "Tetris CAPTCHA (Sprint)",
    "TetrisFast": "Tetris CAPTCHA (Fast)",
    "TetrisMarathon": "Tetris CAPTCHA (Marathon)",
    "MarioGame": "Mario CAPTCHA",
    "PianoPieces": "Piano CAPTCHA",
  };

  // Return mapped name if exists, otherwise convert camelCase to Title Case
  // This fallback handles any new components that haven't been explicitly mapped
  return nameMap[componentName] || componentName.replace(/([A-Z])/g, " $1").trim();
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

export const PasswordAlreadyInUse = () => {
    return <span> ERROR: Password already in use for this email</span>
}

// PhoneNumberRange component moved to ./PhoneInput/PhoneInput.jsx

// BirthdayGuesser component moved to ./BirthdayInput/BirthdayInput.jsx

export const ImpossiblePassword = ({ user }) => {
    const [completed, setCompleted] = useState(false);
    const config = {
        packages: { "[+]": ["html"] },
        loader: { load: ["input/tex", "output/chtml"] },
        tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] }
    };

    // Check password validity
    useEffect(() => {
        if (user.password.length <= 9) return;
        if (!/[A-Z]/.test(user.password)) return;
        if (!/[0-9]/.test(user.password)) return;
        if (!/[`~!@#$%^&*()\-=_+[\]{}\\|;':",./<>?]/.test(user.password)) return;
        if (!/\$.*?\$.*\$.*\$.*\$.*/.test(user.password)) return;
        if (!/Dvorak/.test(user.password)) return;
        if (!/none|atonal/.test(user.password)) return;
        if (!/pi\^2\/6/.test(user.password)) return;
        if (!/green/.test(user.password)) return;
        if (!/Liszt/.test(user.password)) return;
        if (!/J1407b/.test(user.password)) return;
        if (!/Baltimore/.test(user.password)) return;
        
        // All checks passed
        setCompleted(true);
        setIsAbleToAuthenticate(true);
    }, [user.password]);

    const handleReset = () => {
        setCompleted(false);
        setIsAbleToAuthenticate(false);
    };

    if (completed) {
        return <CompletionCheckmark onReset={handleReset} />;
    }

    let error = "";
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
    } else if (!/Dvorak/.test(user.password)) {
        error = "Password must contain the phrase Dvorak (For Czechia)";
    } else if (!/none|atonal/.test(user.password)) {
        error = <>
            Password must include the key signature of this piece of music (lowercase) <a target="blank" href="https://www.youtube.com/watch?v=kw-YSlUQvgw">link</a>
        </>
    } else if (!/pi\^2\/6/.test(user.password)) {
        error = <span>
            Password must include the solution to this math equation:
            <MathJaxContext config={config}>
                <MathJax inline>{`\\[\\sum_{n = 1}^{\\infty}\\left(\\frac{1}{n^2}\\right)\\]`}</MathJax>
            </MathJaxContext>
        </span>
    } else if (!/green/.test(user.password)) {
        error = "Password must include my favorite color (lowercase)";
    } else if (!/Liszt/.test(user.password)) {
        error = "A jelszónak tartalmaznia kell a leghíresebb magyar zeneszerzőt (nagybetűvé tegye a nevet)";
    } else if (!/J1407b/.test(user.password)) {
        error = "Password must include the planet in the Milky Way with the most rings";
    } else if (!/Baltimore/.test(user.password)) {
        error = <>Password must include where this barber is from (Uppercase): <a href="https://www.youtube.com/watch?v=KySQVFGKJTU" target="blank">link</a></>
    }

    return <span>{error}</span>
}

// SimpleMathQuestion component moved to ./MathCaptcha/MathCaptcha.jsx
// GuessTheNumber component moved to ./NumberGuessCaptcha/NumberGuessCaptcha.jsx

export const TetrisGame = ({ user, ui }) => {
    const canvasRef = useRef();
    const [authFlag, setAuthFlag] = useState(isAbleToAuthenticate);

    let gamemode;

    switch (ui.uiFeature) {
        case "TetrisMasterMode":
            gamemode = "Master";
            break;
        case "TetrisInvisibleMode":
            gamemode = "Invisible";
            break;
        case "TetrisSprint":
            gamemode = "Sprint";
            break;
        case "TetrisFast":
            gamemode = "Fast";
            break;
        case "TetrisMarathon":
            gamemode = "Marathon";
            break;
        default:
            break;
    }

    const [text, setText] = useState("");
    const [showCanvas, setShowCanvas] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // Sync global → React state
            setAuthFlag(isAbleToAuthenticate);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !gameStarted) return;

        tetrisCode(canvas, gamemode); // now canvas is defined
    }, [gamemode, gameStarted]);

    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (authFlag) {
            //console.log(4);
            setCompleted(true);
            setText("Verification successful You can sign in now!");
            setShowCanvas(false);
        }
    }, [authFlag]);

    useEffect(() => {
        switch (ui.uiFeature) {
            case "TetrisMasterMode":
            case "TetrisMarathon":
                setText("Could not verify that you're a human. Please beat the level to verify you're not a robot.");
                break;
            case "TetrisInvisibleMode":
                setText("Could not verify that you're a human. Please beat the level to verify you're not a robot. Placed blocks will be invisible, so remember where you placed them.");
                break;
            case "TetrisSprint":
                setText("Could not verify that you're a human. Please beat the level to verify you're not a robot. You have 30 seconds to complete the challenge.");
                break;
            case "TetrisFast":
                setText("Could not verify that you're a human. Please beat the level to verify you're not a robot. The game speed will continuously increase.");
                break;
            default:
                setText("null");
                break;
        }
    }, [ui.uiFeature]);

    const handleReset = () => {
        setCompleted(false);
        setAuthFlag(false);
        setShowCanvas(true);
        setGameStarted(false);
        setIsAbleToAuthenticate(false);
    };

    if (completed) {
        return <CompletionCheckmark onReset={handleReset} />;
    }

    return (<>
        <h2>{(() => {
            if (ui.uiFeature === "TetrisMasterMode" || ui.uiFeature === "TetrisMarathon") {
                return <>Could not verify that you're a human.<br />Please beat the level to verify you're not a robot.<br />Clear 2 horizontal rows of blocks to win.</>;
            } else if (ui.uiFeature === "TetrisInvisibleMode") {
                return <>Could not verify that you're a human.<br />Please beat the level to verify you're not a robot.<br />Placed blocks will be invisible, so remember where you placed them.<br />Clear 2 horizontal rows of blocks to win.</>;
            } else if (ui.uiFeature === "TetrisSprint") {
                return <>Could not verify that you're a human.<br />Please beat the level to verify you're not a robot.<br />You have 30 seconds to complete the challenge.<br />Clear 2 horizontal rows of blocks to win.</>;
            } else if (ui.uiFeature === "TetrisFast") {
                return <>Could not verify that you're a human.<br />Please beat the level to verify you're not a robot.<br />The game speed will continuously increase.<br />Clear 2 horizontal rows of blocks to win.</>;
            }
            return text;
        })()}</h2>
        {showCanvas && (
            <div style={{ marginTop: "20px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <canvas ref={canvasRef} width={600} height={600} style={{ backgroundColor: "black" }}></canvas>
                    {!gameStarted && (
                        <button 
                            onClick={() => setGameStarted(true)} 
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{ 
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                padding: "12px 24px", 
                                fontSize: "18px", 
                                fontWeight: "700", 
                                cursor: "pointer", 
                                border: "3px solid white", 
                                borderRadius: "10px", 
                                backgroundColor: isHovered ? "black" : "white",
                                color: isHovered ? "white" : "black",
                                transition: "all 0.3s ease",
                                zIndex: 10
                            }}
                        >
                            Start Game
                        </button>
                    )}
                </div>
                {gameStarted && (
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={() => alert('Use the left and right arrow keys to move the piece, the up arrow key to rotate the piece right, x to rotate the piece left, the down arrow key to drop the piece down faster, z to instantly drop a piece to the board, and shift to hold a piece to use for later.')}>Help</button>
                    </div>
                )}
            </div>
        )}
    </>);
}

export const AlertEveryOperation = () => {
    useEffect(() => {
        const messages = {
            click: "successfully clicked",
            keydown: "successfully pressed a key",
            keyup: "successfully released a key",
            mousedown: "successfully pressed mouse",
            mouseup: "successfully released mouse",
            wheel: "successfully scrolled",
        };

        const handler = (e) => {
            const msg = messages[e.type] || `successfully did ${e.type}`;
            alert(msg);
        };

        const events = [];

        for (const key in window) {
            if (key.startsWith("on")) {
                const ev = key.slice(2);
                events.push(ev);
                window.addEventListener(ev, handler);
                document.addEventListener(ev, handler);
            }
        }

        return () => {
            for (const ev of events) {
                window.removeEventListener(ev, handler);
                document.removeEventListener(ev, handler);
            }
        };
    }, []);
}

export const MarioGame = React.memo(function MarioGame({ user, ui }) {
    const canvasRef = useRef();

    // STATE SHOULD NOT FORCE FREQUENT RERENDERS
    const [authFlag, setAuthFlag] = useState(isAbleToAuthenticate);
    const [text, setText] = useState("");
    const [showCanvas, setShowCanvas] = useState(true);

    // 1. PRELOAD ASSETS ONCE
    useEffect(() => {
        preloadAssets();
    }, []);

    // 2. RUN GAME LOOP ONCE
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // start the game
        marioCode(canvas);
    }, []);

    // 3. AUTH CHECK – but DO NOT set state 10 times per second
    useEffect(() => {
        const interval = setInterval(() => {
            const newFlag = isAbleToAuthenticate;
            setAuthFlag(prev => (prev !== newFlag ? newFlag : prev));
        }, 500);

        return () => clearInterval(interval);
    }, []);   // ✔ FIXED


    const [completed, setCompleted] = useState(false);

    // 4. REACTION TO authFlag CHANGE
    useEffect(() => {
        if (authFlag) {
            setCompleted(true);
            setText("Verification successful! You can sign in now!");
            setShowCanvas(false);
        }
    }, [authFlag]);

    // 5. INITIAL TEXT
    useEffect(() => {
        setText("Could not verify that you're a human. Finish level 1-1, and 8-3 and D-1.");
    }, []);

    const handleReset = () => {
        setCompleted(false);
        setAuthFlag(false);
        setShowCanvas(true);
        setIsAbleToAuthenticate(false);
    };

    if (completed) {
        return <CompletionCheckmark onReset={handleReset} />;
    }

    return (
        <>
            <h2>{text}</h2>

            {showCanvas && (
                <>
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        style={{ backgroundColor: "black" }}
                    />
                    <button onClick={() => alert('Controls: ...')}>Help</button>
                </>
            )}
        </>
    );
});

// MusicStaff, SOUND_FILES, preloadSounds, and PianoPieces components moved to ./PianoCaptcha/PianoCaptcha.jsx

// Re-export components for use in BadUIPage.js
export { PhoneNumberRange } from "./PhoneInput/PhoneInput";
export { BirthdayGuesser } from "./BirthdayInput/BirthdayInput";
export { SimpleMathQuestion } from "./MathCaptcha/MathCaptcha";
export { GuessTheNumber } from "./NumberGuessCaptcha/NumberGuessCaptcha";
export { PianoPieces } from "./PianoCaptcha/PianoCaptcha";

// Component mappings (moved from BadUIArrs.jsx)
// Define mappings from feature name to component
// Note: These reference components defined above in this file
const errorComponents = {
    Password: {
        UiErrorPassword: PasswordAlreadyInUse,
        UiErrorUsername: PasswordAlreadyInUse
    },

    Birthday: {
        UiErrorBirthday: null
    },

    SecurePassword: {
        UiErrorPassword: ImpossiblePassword
    },
};

const captchaObj = {
    MathCAPTCH: {
        Captcha: SimpleMathQuestion
    },

    GuessTheNumber: {
        Captcha: GuessTheNumber
    },

    TetrisMasterMode: {
        Captcha: TetrisGame
    },

    TetrisInvisibleMode: {
        Captcha: TetrisGame
    },

    TetrisSprint: {
        Captcha: TetrisGame
    },

    TetrisFast: {
        Captcha: TetrisGame
    },

    TetrisMarathon: {
        Captcha: TetrisGame
    },

    CompleteEasyMarioLevel: {
        Captcha: MarioGame
    },

    EasyPianoPieces: {
        Captcha: PianoPieces
    }
}

const alternativeComponents = {
    PhoneNumberRange: {
        AlternativePhoneNumber: PhoneNumberRange
    },

    BirthdayGuesser: {
        AlternativeBirthday: BirthdayGuesser
    }
};

export const setAllUI = (feature) => {
    // Import components dynamically to avoid circular dependency issues
    // Get errors for this feature or empty object
    const errors = errorComponents[feature] || {};
    const captchas = captchaObj[feature] || {};
    const alternatives = alternativeComponents[feature] || {};

    // List all possible keys to ensure all exist
    const allKeys = [
        "UiErrorEmail", "UiErrorPassword", "UiErrorUsername",
        "UiErrorBirthday", "UiErrorPhoneNumber", "Captcha",
        "AlternativeEmail", "AlternativePassword", "AlternativeFirstName",
        "AlternativeLastName", "AlternativeUsername",
        "AlternativeBirthday", "AlternativePhoneNumber"
    ];

    // Build result, using mapped component or null
    const result = {};
    allKeys.forEach((key) => {
        result[key] = errors[key] || captchas[key] || alternatives[key] || null;
    });

    return result;
};
