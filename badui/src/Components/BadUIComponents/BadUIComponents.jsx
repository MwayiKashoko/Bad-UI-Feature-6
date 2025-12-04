import { useState, useRef, useEffect } from "react"
import { generateRandomDate, generateRandomDateObject } from "../Scripts/BadUIScripts";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { random, expandBinomial, isAbleToAuthenticate, setIsAbleToAuthenticate } from "../Scripts/publicVars";
import { tetrisCode } from "./Tetris/Tetris";
import * as math from "mathjs";
import { marioCode } from "./Mario/Mario";
import { preloadAssets } from "./Mario/preloadAssets";
import React from "react";

export const BirthdayNeverAvailable = () => {
    return <span> ERROR: Birthday already in use. Please choose another</span>
}

export const PasswordAlreadyInUse = () => {
    return <span> ERROR: Password already in use for this email</span>
}

export const PhoneNumberRange = () => {
    const [phoneNumber, setPhoneNumber] = useState("+(50) 500-000-0000");

    const handleChange = (e) => {
        const val = e.target.value;
        const formatted = `+(${val.length === 11 ? val.substring(0, 1) : val.substring(0, 2)}) ${val.length === 11 ? val.substring(1, 4) : val.substring(2, 5)}-${val.length === 11 ? val.substring(4, 7) : val.substring(5, 8)}-${val.length === 11 ? val.substring(7, 11) : val.substring(8, 12)}`;
        setPhoneNumber(formatted);
    };

    setIsAbleToAuthenticate(true);

    return (
        <span>
            <label>Enter Phone Number: <input onChange={handleChange} min="10000000000" max="999999999999" type='range' /></label> {phoneNumber}
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

    setIsAbleToAuthenticate(true);

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

    const inputRef = useRef();

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
    } else {
        setIsAbleToAuthenticate(true);
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
            //console.log(math.gcd(num1, num2));
            break;
        case 2:
            num1 = random(5, 10);
            num2 = random(5, 10);
            num3 = random(5, 10);
            formula = `Expand \\[(${num1}x+${num2}y)^${num3} \\]`;
            //console.log(expandBinomial(num1, num2, num3));
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

            //console.log(actualAnswer);

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
            //console.log(math.det(matrixValues));
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
            //console.log("CORRRECT");
        } else {
            //console.log("NOPE");
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
                if (checkIfMathRight() || isAbleToAuthenticate) {
                    setNumSolvedEquations(numSolvedEquations + 1);
                } else {
                    setNumSolvedEquations(0);
                }

                setTypeOfEquation(random(1, 4));

                if (numSolvedEquations === 3) {
                    setIsAbleToAuthenticate(true);
                    formula = ``;
                    setText("Success!!! Press signup to login");
                } else {
                    setText("Please try again and solve this equation:");
                }
            }}>Submit Answer</button> <br /> <br />
        </span>
    );
}

export const GuessTheNumber = () => {
    const [num, setNum] = useState(random(1, Number.MAX_SAFE_INTEGER));
    const [text, setText] = useState("");
    const inputRef = useRef();

    return (<>
        <h2>Guess the number I'm thinking of between 1 and {Number.MAX_SAFE_INTEGER}:</h2>
        <span>{text}</span> <br /><br />
        <input ref={inputRef} /> <button onClick={() => {
            const isTrue = parseInt(inputRef.current.value) === num;

            if (isTrue) {
                setIsAbleToAuthenticate(true);
                setText("You can authenticate!");
            } else {
                setNum(random(1, Number.MAX_SAFE_INTEGER));
                setText("Try Again!");
            }
        }}>Submit</button> <br /><br />
    </>);
}

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

    useEffect(() => {
        const interval = setInterval(() => {
            // Sync global → React state
            setAuthFlag(isAbleToAuthenticate);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        tetrisCode(canvas, gamemode); // now canvas is defined
    }, [gamemode]);

    useEffect(() => {
        if (authFlag) {
            //console.log(4);
            setText("Verification successful You can sign in now!");
            setShowCanvas(false);
        }
    }, [authFlag]);

    useEffect(() => {
        switch (ui.uiFeature) {
            case "TetrisMasterMode":
                setText("Could not verify that you're a human. Please clear 20 lines to verify you are not a robot.");
                break;
            case "TetrisInvisibleMode":
                setText("Could not verify that you're a human. Please clear 10 lines to verify you are not a robot.");
                break;
            case "TetrisSprint":
                setText("Could not verify that you're a human. Please clear 20 lines in under 30 seconds to verify you are not a robot.");
                break;
            case "TetrisFast":
                setText("Could not verify that you're a human. Please clear 20 lines to verify you are not a robot.");
                break;
            case "TetrisMarathon":
                setText("Could not verify that you're a human. Please clear Marathon mode to verify you are not a robot.");
                break;
            default:
                setText("null");
                break;
        }
    }, [ui.uiFeature]);

    return (<>
        <h2>{text}</h2>
        {showCanvas && <>
            <canvas ref={canvasRef} width={600} height={600} style={{ backgroundColor: "black", marginRight: "20px" }}></canvas>
            <button onClick={() => alert('Use the left and right arrow keys to move the piece, the up arrow key to rotate the piece right, x to rotate the piece left, the down arrow key to drop the piece down faster, z to instantly drop a piece to the board, and shift to hold a piece to use for later.')}>Help</button> <br /> <br />
        </>}
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


    // 4. REACTION TO authFlag CHANGE
    useEffect(() => {
        if (authFlag) {
            setText("Verification successful! You can sign in now!");
            setShowCanvas(false);
        }
    }, [authFlag]);

    // 5. INITIAL TEXT
    useEffect(() => {
        setText("Could not verify that you're a human. Finish level 1-1.");
    }, []);

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

export const PianoPieces = () => {
    //s to l from C3 to C4 originally
    //Holding shift brings notes up octave

    const [activeKey, setActiveKey] = useState(null);

    const whiteKeys = [
        { note: 'B', id: -1, key: "a", shift: -1 },
        { note: 'C', id: 0, key: "s", shift: 0 },
        { note: 'D', id: 2, key: "d", shift: 0 },
        { note: 'E', id: 4, key: "f", shift: 0 },
        { note: 'F', id: 5, key: "g", shift: 0 },
        { note: 'G', id: 7, key: "h", shift: 0 },
        { note: 'A', id: 9, key: "j", shift: 0 },
        { note: 'B', id: 11, key: "k", shift: 0 },
        { note: 'C', id: 12, key: "l", shift: 1 },
        { note: 'D', id: 14, key: ";", shift: 1 },
        { note: 'E', id: 16, key: "'", shift: 1 }
    ];

    const whiteKeyLetters = {
        "a": 0,
        "s": 1,
        "d": 2,
        "f": 3,
        "g": 4,
        "h": 5,
        "j": 6,
        "k": 7,
        "l": 8,
        ";": 9,
        "'": 10
    };

    const blackKeys = [
        { note: 'Db', id: 1, position: 2, key: "e", shift: 0 },
        { note: 'Eb', id: 3, position: 3, key: "r", shift: 0 },
        { note: 'Gb', id: 6, position: 5, key: "y", shift: 0 },
        { note: 'Ab', id: 8, position: 6, key: "u", shift: 0 },
        { note: 'Bb', id: 10, position: 7, key: "i", shift: 0 },
        { note: 'Db', id: 13, position: 9, key: "p", shift: 1 },
        { note: 'Eb', id: 15, position: 10, key: "[", shift: 1 },
    ];

    const blackKeyLetters = {
        "e": 0,
        "r": 1,
        "y": 2,
        "u": 3,
        "i": 4,
        "p": 5,
        "[": 6
    };

    const handleKeyPress = (note, id) => {
        setActiveKey(id);
        setTimeout(() => setActiveKey(null), 200);
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const pianoContainerStyle = {
        position: 'relative',
    };

    const whiteKeysContainerStyle = {
        display: 'flex',
    };

    const whiteKeyStyle = (isActive) => ({
        position: 'relative',
        width: '64px',
        height: '256px',
        backgroundColor: isActive ? '#e5e7eb' : '#ffffff',
        border: '2px solid #1f2937',
        borderRadius: '0 0 8px 8px',
        cursor: 'pointer',
        transition: 'all 0.1s',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.3)',
    });

    const blackKeysContainerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    };

    const blackKeyStyle = (isActive, position) => ({
        position: 'absolute',
        left: `${position * 64 - 24}px`,
        width: '48px',
        height: '160px',
        backgroundColor: isActive ? '#4b5563' : '#000000',
        border: '2px solid #111827',
        borderRadius: '0 0 8px 8px',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'all 0.1s',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.5)' : '0 6px 8px rgba(0,0,0,0.5)',
    });

    const noteLabelStyle = (isBlack) => ({
        position: 'absolute',
        bottom: isBlack ? '8px' : '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: isBlack ? '12px' : '14px',
        fontWeight: '600',
        color: isBlack ? '#ffffff' : '#4b5563',
    });

    /*useEffect(() => {
        const handle = (e) => {
            let sound = new Audio();

            if (e.key in whiteKeyLetters) {
                const note = whiteKeys[whiteKeyLetters[e.key]];
                sound.src = `/pianoNotes/${note.note}${4 + note.shift}.mp3`;
            } else if (e.key in blackKeyLetters) {
                const note = blackKeys[blackKeyLetters[e.key]];
                sound.src = `/pianoNotes/${note.note}${4 + note.shift}.mp3`;
            }

            if (!sound) return;

            // cleanup after finished
            sound.addEventListener("ended", () => {
                sound = null; // release reference
            });

            sound.play();
        };

        window.addEventListener("keydown", handle);

        return () => {
            window.removeEventListener("keydown", handle);
        };
    }, []);*/

    useEffect(() => {
        const held = new Set(); // tracks currently pressed keys

        const handle = (e) => {
            if (held.has(e.code)) return; // ignore if key is still held
            held.add(e.code);

            let sound = null;

            if (e.key in whiteKeyLetters) {
                const note = whiteKeys[whiteKeyLetters[e.key]];
                sound = new Audio(`/pianoNotes/${note.note}${4 + note.shift}.mp3`);
            } else if (e.key in blackKeyLetters) {
                const note = blackKeys[blackKeyLetters[e.key]];
                sound = new Audio(`/pianoNotes/${note.note}${4 + note.shift}.mp3`);
            }

            if (!sound) return;

            // release reference after finished and remove from held
            sound.addEventListener("ended", () => {
                sound = null;
                held.delete(e.code); // now key can be played again
            });

            sound.play();
        };

        const handleUp = (e) => {
            held.delete(e.code); // release key if released manually
        };

        window.addEventListener("keydown", handle);
        window.addEventListener("keyup", handleUp);

        return () => {
            window.removeEventListener("keydown", handle);
            window.removeEventListener("keyup", handleUp);
        };
    }, []);


    return (
        <div style={containerStyle}>
            <div style={pianoContainerStyle}>
                {/* White keys */}
                <div style={whiteKeysContainerStyle}>
                    {whiteKeys.map((key) => (
                        <button
                            key={key.id}
                            style={whiteKeyStyle(activeKey === key.id)}
                        >
                            <span style={noteLabelStyle(false)}>
                                {key.key}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Black keys */}
                <div style={blackKeysContainerStyle}>
                    {blackKeys.map((key) => (
                        <button
                            key={key.id}
                            //onClick={() => handleKeyPress(key.note, key.id)}
                            style={blackKeyStyle(activeKey === key.id, key.position)}
                        >
                            <span style={noteLabelStyle(true)}>
                                {key.key}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}