import { useState, useRef, useEffect, useMemo } from "react"
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
        <>
            {text}

            {!isAbleToAuthenticate &&
                <span>
                    <MathJaxContext config={config}>
                        <MathJax inline>{formula}</MathJax>
                    </MathJaxContext>

                    <input ref={inputRef} /> <button onClick={() => {
                        if (checkIfMathRight() || isAbleToAuthenticate) {
                            setIsAbleToAuthenticate(true);
                            formula = ``;
                            setText("Success!!! Press signup to login");
                        }

                        setTypeOfEquation(random(1, 4));
                    }}>Submit Answer</button> <br /> <br />
                </span>}
        </>
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
        setText("Could not verify that you're a human. Finish level 1-1, and 8-3 and D-1.");
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

const MusicStaff = ({ notes }) => {
    // Staff configuration
    const staffWidth = 800;
    const staffHeight = 200;
    const lineSpacing = 15;
    const startX = 100;
    const startY = 80;
    const noteSpacing = 40;

    // Note positions on the staff (middle line = 0, above = negative, below = positive)
    const notePositions = {
        'E4': 1, 'D4': 2, 'C4': 3, 'B3': 4, 'A3': 5, 'G3': 6,
        'F3': 7, 'E3': 8, 'D3': 9, 'C3': 10, 'B2': 11
    };

    const parseNote = (noteStr) => {
        const match = noteStr.match(/([A-G])(#|b|n)?(\d)?/);
        if (!match) return null;

        const [, letter, accidental = '', octave = '4'] = match;
        return {
            letter,
            accidental,
            octave,
            fullNote: `${letter}${octave}`
        };
    };

    const getNoteY = (note) => {
        const parsed = parseNote(note);
        if (!parsed) return startY;

        const position = notePositions[parsed.fullNote] || 0;
        return startY + position * (lineSpacing / 2);
    };

    const needsLedgerLine = (note) => {
        const parsed = parseNote(note);
        if (!parsed) return [];

        const position = notePositions[parsed.fullNote];
        const ledgerLines = [];

        if (position < -6) {
            for (let i = -8; i >= position; i -= 2) {
                ledgerLines.push(i);
            }
        } else if (position > 6) {
            for (let i = 8; i <= position; i += 2) {
                ledgerLines.push(i);
            }
        }

        return ledgerLines;
    };

    // Split notes into measures (4 beats per measure, 16th notes = 4 per beat)
    const notesPerMeasure = 16;
    const measures = [];
    for (let i = 0; i < notes.length; i += notesPerMeasure) {
        measures.push(notes.slice(i, i + notesPerMeasure));
    }

    const centeredStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: "20px",
    }

    return (
        <div style={centeredStyle}>
            <svg width={staffWidth} height={staffHeight * measures.length + 100} style={{ backgroundColor: 'white' }}>
                {
                    measures.map((measure, measureIndex) => {
                        const measureY = measureIndex * staffHeight + startY;

                        return (
                            <g key={measureIndex}>
                                {/* Staff lines */}
                                {[0, 1, 2, 3, 4].map((lineIndex) => (
                                    <line
                                        key={lineIndex}
                                        x1={startX - 60}
                                        y1={measureY + lineIndex * lineSpacing}
                                        x2={staffWidth - 50}
                                        y2={measureY + lineIndex * lineSpacing}
                                        stroke="black"
                                        strokeWidth="1.5"
                                    />
                                ))}

                                {/* Treble clef */}
                                <text
                                    x={startX - 50}
                                    y={measureY + 45}
                                    fontSize="80"
                                    fontFamily="serif"
                                    fill="black"
                                >
                                    𝄞
                                </text>

                                {/* Time signature (4/4) - only on first measure */}
                                {measureIndex === 0 && (
                                    <g>
                                        <text x={startX - 10} y={measureY + 15} fontSize="24" fontFamily="serif">4</text>
                                        <text x={startX - 10} y={measureY + 45} fontSize="24" fontFamily="serif">4</text>
                                    </g>
                                )}

                                {/* Measure line at start */}
                                <line
                                    x1={startX - 60}
                                    y1={measureY}
                                    x2={startX - 60}
                                    y2={measureY + 60}
                                    stroke="black"
                                    strokeWidth="2"
                                />

                                {/* Notes */}
                                {measure.map((note, noteIndex) => {
                                    const parsed = parseNote(note);
                                    if (!parsed) return null;

                                    const x = startX + 20 + noteIndex * noteSpacing;
                                    const y = getNoteY(note);
                                    const adjustedY = y + (measureIndex * staffHeight);
                                    const ledgerLines = needsLedgerLine(note);

                                    return (
                                        <g key={noteIndex}>
                                            {/* Ledger lines */}
                                            {ledgerLines.map((linePos) => (
                                                <line
                                                    key={linePos}
                                                    x1={x - 8}
                                                    y1={measureY + linePos * (lineSpacing / 2)}
                                                    x2={x + 8}
                                                    y2={measureY + linePos * (lineSpacing / 2)}
                                                    stroke="black"
                                                    strokeWidth="1.5"
                                                />
                                            ))}

                                            {/* Accidental (sharp or flat) */}
                                            {parsed.accidental && (
                                                <text
                                                    x={x - 20}
                                                    y={adjustedY + 4}
                                                    fontSize="20"
                                                    fontFamily="serif"
                                                    fill="black"
                                                >
                                                    {parsed.accidental === '#' ? '♯' : (parsed.accidental === "b" ? '♭' : "♮")}
                                                </text>
                                            )}

                                            {/* Note head */}
                                            <ellipse
                                                cx={x}
                                                cy={adjustedY}
                                                rx="5"
                                                ry="4"
                                                fill="black"
                                                transform={`rotate(-20 ${x} ${adjustedY})`}
                                            />

                                            {/* Stem */}
                                            <line
                                                x1={x + 4.5}
                                                y1={adjustedY}
                                                x2={x + 4.5}
                                                y2={adjustedY - 30}
                                                stroke="black"
                                                strokeWidth="1.5"
                                            />

                                            {/* Flag for 16th note */}
                                            <path
                                                d={`M ${x + 4.5} ${adjustedY - 30} q 8 2 8 8 q 0 -4 -8 -6`}
                                                fill="black"
                                            />
                                            <path
                                                d={`M ${x + 4.5} ${adjustedY - 24} q 8 2 8 8 q 0 -4 -8 -6`}
                                                fill="black"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Measure line at end */}
                                <line
                                    x1={startX + 20 + measure.length * noteSpacing}
                                    y1={measureY}
                                    x2={startX + 20 + measure.length * noteSpacing}
                                    y2={measureY + 60}
                                    stroke="black"
                                    strokeWidth="2"
                                />
                            </g>
                        );
                    })
                }
            </svg >
        </div>
    );
};

const SOUND_FILES = ["Bb2", "B2", "C3", "Db3",
    "D3", "Eb3", "E3", "F3",
    "Gb3", "G3", "Ab3", "A3",
    "Bb3", "B3", "C4", "Db4",
    "D4", "Eb4", "E4"];

const preloadSounds = () => {
    const sounds = {};

    const load = (src) =>
        new Promise((resolve) => {
            const audio = new Audio();
            audio.src = `/testNotes/${src}.mp3`;
            audio.addEventListener("canplaythrough", () => resolve(audio), { once: true });
        });

    for (const file of SOUND_FILES) {
        sounds[file] = load(file);
    }

    return sounds;
};


export const PianoPieces = () => {
    //q to ' from Bb2 to E4 originally
    const [activeKey, setActiveKey] = useState(null);
    const [startedPlaying, setStartedPlaying] = useState(false);
    const [keysPressed, setKeysPressed] = useState([]);
    const [completedCaptcha, setCompletedCaptcha] = useState(false);

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
        { note: 'Bb', id: -2, position: 0, key: "q", shift: -1 },
        { note: 'Db', id: 1, position: 2, key: "e", shift: 0 },
        { note: 'Eb', id: 3, position: 3, key: "r", shift: 0 },
        { note: 'Gb', id: 6, position: 5, key: "y", shift: 0 },
        { note: 'Ab', id: 8, position: 6, key: "u", shift: 0 },
        { note: 'Bb', id: 10, position: 7, key: "i", shift: 0 },
        { note: 'Db', id: 13, position: 9, key: "p", shift: 1 },
        { note: 'Eb', id: 15, position: 10, key: "[", shift: 1 },
    ];

    const blackKeyLetters = {
        "q": 0,
        "e": 1,
        "r": 2,
        "y": 3,
        "u": 4,
        "i": 5,
        "p": 6,
        "[": 7
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

    const pieces = useMemo(() => {
        return [
            //Bach Fugue in E Minor BWV 855
            {
                name: "Bach Fugue in E Minor BWV 855",
                notes: ["E3", "G3", "B3", "E4",
                    "D#4", "E4", "Dn4", "E4",
                    "C#4", "E4", "Cn4", "E4",
                    "B3", "E4", "D#4", "E4",
                    "A#3", "C#4", "G3", "F#3",
                    "G3", "A3", "F#3", "E3"],
                tempo: 100,
            },

            //Elgar Cello Concerto 2nd mvmt
            {
                name: "Elgar Cello Concerto 2nd mvmt",
                notes: ["B2", "D3", "D3", "D3",
                    "D3", "G3", "G3", "G3",
                    "G3", "Bb3", "Bb3", "Bb3",
                    "Bb3", "F3", "F3", "F3",
                    "F#3", "G3", "G3", "G3",
                    "G3", "Bb3", "Bb3", "Bb3",
                    "Bb3", "Eb4", "Eb4", "Eb4"],
                tempo: 100
            },

            //Liszt Wilde Jagd
            {
                name: "Liszt Wilde Jagd",
                notes: ["Bb3", "C3", "D3",
                    "A3", "C3", "D3",
                    "C4", "Bb2", "D3",
                    "Bb3", "Bb2", "D3",
                    "D4", "D3", "F3",
                    "C4", "D3", "Bb3",
                ],
                tempo: 100
            },

            //Ravel Le Tombeau de Couperin Prelude
            {
                name: "Ravel Le Tombeau de Couperin Prelude",
                notes: ["C#4", "F#3", "C#4", "B3", "Fn3", "B3",
                    "E3", "D3", "E3", "C3", "D3", "E3",
                    "A3", "D#3", "A3", "G3", "Dn3", "G3",
                    "C3", "B2", "C3", "C3", "B2", "C3",
                    "D3", "F3", "E3", "D3", "E3", "C3",
                    "B2", "C3", "C3", "B2", "C3", "D3",
                    "C3", "D3", "E3", "G3", "A3", "C4",
                    "E4", "D4", "E4", "C4", "D4", "E4",
                ],
                tempo: 100
            },

            //Prokofiev Piano Sonata 8 3rd mvmt
            {
                name: "Prokofiev Piano Sonata 8 3rd mvmt",
                notes: ["Bb2", "D3", "F3", "Bn2", "Eb3", "F3",
                    "C3", "En3", "F3", "Bn2", "Eb3", "F3",
                    "Bb2", "D3", "F3", "Bb3", "D3",
                ],
                tempo: 100
            },

            //Chopin Piano Sonata 2 4th mvmt
            {
                name: "Chopin Piano Sonata 2 4th mvmt",
                notes: ["Ab3", "B3", "E4",
                    "Eb4", "Bb3", "Bn3",
                    "D4", "Bb3", "C4",
                    "G3", "Ab3", "E3",
                    "D3", "Eb3", "Ab3",
                    "En3", "F3", "Bn3",
                    "F3", "G3", "B3",
                    "An3", "Bb3", "Eb4",
                    "Db4", "F3", "Bb3",
                    "C#3", "E3", "An3",
                    "C4", "Eb3", "Ab3",
                    "Bn2", "Dn3", "G3",
                    "Bn3", "D3", "Gb3",
                    "Bb2", "Db3", "Gb3",
                    "Bb3", "Gb3", "Bn3",
                    "C4", "Db4", "Eb4",
                    "En4", "Gn3", "C4",
                    "Eb3", "Gb3", "Bn3",
                    "Dn4", "F3", "Bb3",
                    "C#2", "En3", "An3",
                    "C4", "En3", "Ab3",
                    "Bn2", "Dn3", "Gn3",
                    "Bn3", "F#3", "C#4",
                    "Dn4", "Eb4", "En4"
                ],
                tempo: 100
            },

            //Saint-Saens Rondo and Capriccioso
            {
                name: "Saint-Saens Rondo and Capriccioso",
                notes: ["E3", "G#3", "B3", "E4", "B3", "G#3",
                    "E3", "G#3", "B3", "E4", "B3", "G#3",
                    "D3", "G#3", "B3", "E4", "B3", "G#3",
                    "D3", "G#3", "B3", "E4", "B3", "G#3",
                    "C3", "Gn3", "C4", "E4", "C4", "G3",
                    "C3", "Gn3", "C4", "E4", "C4", "G3",
                    "B2", "G#3", "D4", "E4", "D4", "G#3",
                    "B2", "G#3", "D4", "E4", "D4", "G#3"
                ],
                tempo: 100
            },

            //Philip Glass Violin Concerto 1 3rd mvmt
            {
                name: "Philip Glass Violin Concerto 1 3rd mvmt",
                notes: ["D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "G3", "A3", "G3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                    "D3", "F3", "A3", "D4", "A3", "F3",
                ],
                tempo: 80
            },

            //Philip Glass Violin Concerto 1 1st mvmt
            {
                name: "Philip Glass Violin Concerto 1 1st mvmt",
                notes: ["D3", "F3", "A3",
                    "D3", "F3", "A3",
                    "D3", "F3", "A3",
                    "D3", "F3", "A3",
                    "C#3", "F3", "A3",
                    "C#3", "F3", "A3",
                    "C#3", "F3", "A3",
                    "C#3", "F3", "A3",
                    "D3", "F3", "Bb3",
                    "D3", "F3", "Bb3",
                    "D3", "F3", "Bb3",
                    "D3", "F3", "Bb3"
                ],
                tempo: 100
            },

            //Summer Vivaldi Presto
            {
                "name": "Summer Vivaldi Presto",
                notes: ["D4", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "C4", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "Bb3", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "A3", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "D3"
                ],
                tempo: 100
            },

            //Chopin Prelude Op. 28 No 16
            {
                name: "Chopin Prelude Op. 28 No 16",
                notes: ["B2", "C3", "D3", "Eb3",
                    "En3", "F3", "G3", "Ab3",
                    "F#3", "G3", "E3", "F#3",
                    "D3", "Eb3", "D3", "C3",
                    "B2", "C3", "D3", "Eb3",
                    "En3", "F3", "G3", "Ab3",
                    "F#3", "G3", "E3", "F#3",
                    "D3", "Eb3", "D3", "C3",
                    "Db3", "Eb3", "F3", "G3",
                    "Ab3", "Bb3", "Bn3", "C4",
                    "C#4", "D4",
                ],
                tempo: 100
            },

            //Scriabin Sonata 5
            {
                name: "Scriabin Sonata 5",
                notes: ["G3", "F#3", "G3",
                    "G3", "F#3", "G3",
                    "G3", "F#3", "G3",
                    "Ab3", "G3", "Ab3",
                    "G3", "F#3", "G3",
                    "G3", "F#3", "G3",
                    "G3", "F#3", "G3",
                    "Ab3", "G3", "Ab3",

                    "Bb3", "An3", "Bb3",
                    "Bb3", "A3", "Bb3",
                    "Bb3", "A3", "Bb3",
                    "Bn3", "A#3", "B3",
                    "Bb3", "An3", "Bb3",
                    "Bb3", "A3", "Bb3",
                    "Bb3", "A3", "Bb3",
                    "Bn3", "A#3", "B3",

                    "G3", "F#3", "G3",
                    "Ab3", "C4"
                ],
                tempo: 100
            },

            //Balakirev Islamey
            {
                name: "Balakirev Islamey",
                notes: ["Bb3", "Bb3", "Bb3",
                    "Bb3", "A3", "Bb3",
                    "Gb3", "Gb3", "A3",
                    "Bb3", "Db4", "C4",

                    "Ab3", "Ab3", "Ab3",
                    "Ab3", "F3", "Gb3",
                    "Ab3", "Bb3", "Ab3",
                    "F3", "F3", "F3",

                    "Gb3", "Gb3", "An3",
                    "Bb3", "Bb3", "C4",
                    "Eb4", "Eb4", "Db4",
                    "C4", "C4", "Bb3",

                    "Ab3", "Ab3", "Ab3",
                    "Db4", "Db4", "C4",
                    "Bb3", "Ab3", "Bb3",
                    "F3", "F3", "F3",
                ],
                tempo: 100
            },

            //Liszt Hungarian Rhapsody 6
            {
                name: "Liszt Hungarian Rhapsody 6",
                notes: ["F3", "G3", "A3", "Bb3",
                    "C4", "Bb3", "A3", "Bb3",
                    "C4", "C4", "C4", "C4",
                    "C4", "C4", "C4", "C4",
                    "C4", "D4", "D4", "Eb4",
                    "Eb4", "D4", "D4", "C4",
                    "D4", "D4", "D4", "D4",
                    "D4", "D4", "D4", "D4",
                    "Eb4", "D4", "C4", "Bb3",
                    "A3", "G3", "A3", "Bb3",
                    "C4", "C4", "C4", "C4",
                    "C4", "C4", "C4", "C4",
                    "C4", "F3", "F3", "F3",
                    "F3", "C4", "C4", "D4",
                    "Bb3", "Bb3", "Bb3", "Bb3",
                    "Bb3", "Bb3", "Bb3", "Bb3",
                ],
                tempo: 100
            },

            //Liszt Totentaz
            {
                name: "Liszt Totentaz",
                notes: ["F3", "F3", "F3", "F3",
                    "E3", "E3", "E3", "E3",
                    "F3", "F3", "F3", "F3",
                    "D3", "D3", "D3", "D3",
                    "E3", "E3", "E3", "E3",
                    "C3", "C3", "C3", "C3",
                    "D3", "D3", "D3", "D3",
                    "D3", "D3", "D3", "D3",
                    "F3", "F3", "F3", "F3",
                    "F3", "F3", "G3", "G3",
                    "F3", "F3", "E3", "E3",
                    "D3", "D3", "C3", "C3",
                    "E3", "E3", "E3", "E3",
                    "F3", "F3", "F3", "F3",
                    "E3", "E3", "E3", "E3",
                    "E3", "E3", "E3", "E3",
                ],
                tempo: 100
            },

            //Alkan Hands Reunited
            {
                name: "Alkan Hands Reunited",
                notes: ["C3", "D3",
                    "Eb3", "D3", "C3", "Eb3",
                    "D3", "C3", "B2", "D3",
                    "C3", "B2", "C3", "D3",
                    "Eb3", "En3", "F3", "F#3",
                    "G3", "Ab3", "F#3", "Ab3",
                    "G3", "C4", "Bb3", "Ab3",
                    "G3", "Ab3", "F#3", "Ab3",
                    "G3", "Eb4", "D4", "C4",
                    "Bn3", "D4", "Fn3", "Ab3",
                    "G3", "Bn3", "D3", "F3",
                    "Eb3", "G3", "Bn3", "D3",
                    "C3", "Eb3"
                ],
                tempo: 100
            },

            //Bach Dorain Toccata in D Minor
            {
                name: "Bach Dorain Toccata in D Minor",
                notes: ["G3", "F#3", "G3", "E3",
                    "C#4", "G3", "E4", "G3",
                    "F#3", "E3", "F#3", "D3",
                    "A3", "F#3", "D4", "F#3",
                    "E3", "D3", "E3", "D4",
                    "E3", "D3", "E3", "D4",
                    "E3", "D3", "E3", "D4",
                    "E3", "D3", "E3", "D4",
                    "E3", "D3", "E3", "C#4",
                    "E3", "D3", "E3", "C#4",
                    "E3", "D3", "E3", "C#4",
                    "E3", "D3", "E3", "C#4",
                    "D4", "D4", "D4", "D4"
                ],
                tempo: 200
            },

            //Rachmaninoff Moment Musicaux 6 in C Major
            {
                name: "Rachmaninoff Moment Musicaux 6 in C Major",
                notes: ["E4", "C4", "E4", "C3",
                    "G3", "C4", "E4", "C4",
                    "B3", "C4", "E4", "C4",
                    "A3", "C4", "E4", "C4",
                    "Ab3", "C4", "E4", "C4",
                    "G3", "C4", "E4", "C4",

                    "F#3", "C4", "E4", "C4",
                    "G3", "C4", "E4", "C4",
                    "B3", "C4", "E4", "C4",
                    "An3", "C4", "E4", "C4",
                    "Ab3", "C4", "E4", "C4",
                    "G3", "C4", "E4", "G3",

                    "A3", "C4", "E4", "C3",
                    "G3", "C4", "E4", "C4",
                    "B3", "C4", "E4", "C4",
                    "A3", "C4", "E4", "C4",
                    "C4", "C4", "E4", "C4",
                    "G3", "C4", "E4", "C4",

                    "F#3", "C4", "E4", "C4",
                    "G3", "C4", "E4", "C4",
                    "E4", "C4", "E4", "C4",
                    "An3", "C4", "E4", "C4",
                    "Ab3", "C4", "E4", "C4",
                    "A3", "C4", "E4", "G3",
                    "G3", "G3", "G3", "G3"
                ],
                tempo: 100
            },

            //Bach Prelude 2 in C Minor (WTC Book 1)
            {
                name: "Bach Prelude 2 in C Minor (WTC Book 1)",
                notes: ["C4", "Eb3", "D3", "Eb3",
                    "C3", "Eb3", "D3", "Eb3",
                    "C4", "Eb3", "D3", "Eb3",
                    "C3", "Eb3", "D3", "Eb3",

                    "Ab3", "F3", "En3", "F3",
                    "C3", "F3", "E3", "F3",
                    "Ab3", "F3", "En3", "F3",
                    "C3", "F3", "E3", "F3",
                ],
                tempo: 100
            },

            //Bach Prelude 6 in D Minor (WTC Book 1)
            {
                name: "Bach Prelude 6 in D Minor (WTC Book 1)",
                notes: ["A3",
                    "F3", "D3", "A3",
                    "F3", "D3", "D4",
                    "Bb3", "G3", "Bb3",
                    "G3", "E3", "G3",
                    "E3", "C#3", "G3",
                    "E3", "C#3", "A3",
                    "F3", "D3", "A3",
                    "F3", "D3", "A3"],
                tempo: 100
            },

            //Bach BWV 914 Fugue
            {
                name: "Bach BWV 914 Fugue",
                notes: ["B3", "A3", "B3",
                    "G3", "A3", "F#3", "G3",
                    "E3", "E4", "B3", "E4",
                    "G3", "B3", "E3", "C4",
                    "D#3", "C4", "D#3", "C4",
                    "D#3", "C4", "D#3", "C4",
                    "D3", "F#3", "B3", "F#3",
                    "D3", "F#3", "B3", "F#3",
                    "C#3", "B3", "C#3", "B3",
                    "C#3", "B3", "C#3", "B3",
                    "Cn3", "E3", "A3", "E3",
                    "Cn3", "E3", "A3", "E3",
                    "B2", "A3", "G3", "A3",
                    "F#3", "B3", "A3", "B3",
                    "G3", "A3", "F#3", "G3",
                    "E3", "G3", "F#3", "E3"
                ],
                tempo: 100
            },

            //Mendelssohn Piano Concerto 1
            {
                name: "Mendelssohn Piano Concerto 1",
                notes: ["B3", "D4", "G3", "D3",
                    "A#3", "C#4", "G3", "E3",
                    "B3", "D4", "G3", "D3",
                    "G3", "B3", "D3", "B2",

                    "B3", "D4", "G3", "D3",
                    "A#3", "C#4", "G3", "E3",
                    "B3", "D4", "G3", "D3",
                    "G3", "B3", "D3", "B2",

                    "Cn3", "E4", "A3", "E3",
                    "B3", "D#4", "A3", "E3",
                    "Cn3", "E4", "A3", "E3",
                    "A3", "C4", "E3", "C3",

                    "Cn3", "E4", "A3", "E3",
                    "B3", "D#4", "A3", "E3",
                    "Cn3", "E4", "A3", "E3",
                    "Eb4"
                ],
                tempo: 75
            },

            //Bach Prelude and Fugue in D Minor (BWV 539)
            {
                name: "Bach Prelude and Fugue in D Minor (BWV 539)",
                notes: ["G3", "Bb3", "A3", "G3",
                    "F3", "D4", "E3", "D3",
                    "A3", "E3", "G#3", "Bn3",
                    "C4", "E4", "A3", "Gn3",
                    "F#3", "A3", "C4", "Eb4",
                    "D4", "C4", "Bb3", "A3",
                    "Bb3", "D3", "G3", "A3",
                    "Bb3", "D4", "G3", "F3",
                    "E3", "G3", "Bb3", "D4",
                    "C4", "Bb3", "A3", "G3",
                    "A3", "E3", "F3", "C#3",
                    "D3", "F3", "A3", "Cn3",
                    "Bb2", "D3", "F3", "A3",
                    "G3", "E3", "F3", "D3",
                    "C#3", "E3", "G3", "Bb3",
                    "A3", "G3", "F3", "E3",
                    "F3", "D3", "A3", "E3",
                    "F3", "A3", "D4", "G3"
                ],
                tempo: 150
            },

            //Khachaturian Piano Sonatina
            {
                name: "Khachaturian Piano Sonatina",
                notes: ["C3", "E3", "G3", "E3",
                    "B2", "E3", "G3", "E3",
                    "C3", "E3", "G3", "E3",
                    "A3", "E3", "G3", "E3",

                    "C3", "E3", "G3", "E3",
                    "B2", "E3", "G3", "E3",
                    "C3", "E3", "G3", "E3",
                    "A3", "E3", "G3", "E3",

                    "C3", "Eb3", "Gb3", "Eb3",
                    "B2", "Eb3", "Gb3", "Eb3",
                    "C3", "Eb3", "Gb3", "Eb3",
                    "A3", "Eb3", "Gb3", "Eb3",

                    "D3", "Eb3", "Gb3", "Eb3",
                    "C3", "Eb3", "Gb3", "Eb3",
                    "B2", "Eb3", "Gb3", "Eb3",
                    "A3", "Eb3", "Gb3", "Eb3",
                ],
                tempo: 100
            },

            //Bach Prelude in C# Major (WTC Book 2)
            {
                name: "Bach Prelude in C# Major (WTC Book 2)",
                notes: ["G#3", "F3", "G#3", "C#4",
                    "G#3", "F#3", "G#3", "F3",
                    "G#3", "F3", "G#3", "C#4",
                    "G#3", "F#3", "G#3", "F3",

                    "A#3", "F#3", "A#3", "C#4",
                    "A#3", "G#3", "A#3", "F#3",
                    "A#3", "F#3", "A#3", "C#4",
                    "A#3", "G#3", "A#3", "F#3",

                    "C#3", "Fn3", "G#3", "D#4",
                    "G#3", "F#3", "G#3", "F#3",
                    "C#3", "Fn3", "G#3", "D#4",
                    "G#3", "F#3", "G#3", "F#3",

                    "A#3", "D#3", "Gn3", "A#3",
                    "G3", "Fn3", "G3", "D#3",
                    "A#3", "D#3", "Gn3", "A#3",
                    "G3", "Fn3", "G3", "D#3",
                ],
                tempo: 200
            },

            //Rachmaninoff Prelude in C# Minor
            {
                name: "Rachmaninoff Prelude in C# Minor",
                notes: ["E4", "G#3", "C#4",
                    "D#4", "Gn3", "C#4",
                    "Dn4", "F#3", "Cn4",
                    "C#4", "E3", "G#3",
                    "E4", "G#3", "C#4",
                    "D#4", "Gn3", "C#4",
                    "Dn4", "F#3", "Cn4",
                    "C#4", "E3", "G#3",
                ],
                tempo: 100
            },

            //Tchaikovsky Piano Concerto 1
            {
                name: "Tchaikovsky Piano Concerto 1",
                notes: ["Bb3", "Bb2", "C3", "Bb2",
                    "C4", "Bb2", "C3", "Bb2",
                    "D4", "Bb2", "C3", "Bb2",
                    "Bb3", "Bb2", "C3", "Bb2",
                    "C4", "Bb2", "C3", "Bb2",
                    "D4", "Bb2", "C3", "Bb2",
                    "Eb4", "Bb2", "C3", "Bb2",
                    "Bb3", "Bb2", "C3", "Bb2",
                    "C4", "Bb2", "C3", "Bb2",
                    "F3", "Bb2", "C3", "Bb2",
                    "C4", "Bb2", "C3", "Bb2",
                    "F3", "Bb2", "C3", "Bb2",
                    "C4", "Bb2", "C3", "Bb2",
                    "Bb3", "Bb2", "C3", "Bb2",
                    "C4", "Bb2", "C3", "Bb2",
                    "G3", "Bb2", "C3", "Bb2",
                ],
                tempo: 100
            },

            //Mendelssohn Violin Concerto
            {
                name: "Mendelssohn Violin Concerto",
                notes: ["E4", "E4", "B3", "B3",
                    "C#4", "C#4", "B3", "B3",
                    "C#4", "C#4", "B3", "B3",
                    "C#4", "C#4", "B3", "B3",
                    "A3", "A3", "B3", "B3",
                    "C#4", "C#4", "B3", "B3",
                    "C#4", "C#4", "B3", "B3",
                    "C#4", "C#4", "B3", "B3",
                    "B3", "B3", "A3", "A3",
                    "B3", "B3", "Cn4", "C4",
                    "C#4", "C#4", "D#4", "D#4",
                    "E4", "E4", "F#3", "F#3",
                    "G#3", "G#3", "E4", "E4",
                    "B3", "B3", "G#3", "G#3",
                    "B3", "B3", "A3", "A3",
                    "F#3", "F#3", "B3", "B3"
                ],
                tempo: 80
            },

            //Prokofiev Violin Sonata 1
            {
                name: "Prokofiev Violin Sonata 1",
                notes: ["E3", "G3", "C4", "G3", "C4", "G3",
                    "E3", "G3", "C4", "G3", "C4", "G3",
                    "E3", "G#3", "C4", "G#3", "C4", "G#3",
                    "E3", "G#3", "C4", "G#3", "C4", "G#3",
                    "E3", "A3", "C4", "A3", "C4", "A3",
                    "E3", "A3", "C4", "A3", "C4", "A3",
                    "A3", "C4", "F3", "E4", "F3", "E4",
                    "D4", "E4", "D4", "C4", "Bb3", "A3"
                ],
                tempo: 130
            },

            //Hungarian Rhapsody 18
            {
                name: "Hungarian Rhapsody 18",
                notes: ["D3", "E3", "D3", "C#3",
                    "D3", "A3", "G3", "E3",
                    "D3", "E3", "D3", "C#3",
                    "D3", "A3", "G3", "E3",
                    "D3", "E3", "D3", "C#3",
                    "D3", "A3", "G3", "E3",
                    "D3", "A3", "G3", "E3",
                    "D3", "A3", "G3", "E3",
                    "D3"
                ],
                tempo: 100
            },

            //Meraux Etude Op. 63 No. 8
            {
                name: "Meraux Etude Op. 63 No. 8",
                notes: ["C4", "C3", "E3", "G3",
                    "B3", "E4", "C3", "E3",
                    "A3", "C4", "E4", "C3",
                    "G3", "C4", "E4", "G3",
                    "G#3", "G#3", "F3", "D3",
                    "A3", "F3", "F3", "D3",
                    "Bb3", "F3", "D3", "F3",
                    "Bn3", "G3", "F3", "D3"
                ],
                tempo: 100
            },
        ];

    }, []);

    const [currentPieceIndex, setCurrentPieceIndex] = useState(random(0, pieces.length - 1));

    const changeNote = (note, sharped) => {
        if (!note.includes("#") && !note.includes("b")) return false;
        if (note.includes("#") && sharped) return false;
        if (note.includes("b") && !sharped) return false;

        const letter = note[0];           // A–G
        const accidental = note.slice(1); // "#" or "b"

        const letters = ["A", "B", "C", "D", "E", "F", "G"];
        let index = letters.indexOf(letter);

        // move up or down one letter
        index = !sharped ? index + 1 : index - 1;

        // wrap around
        if (index > 6) index = 0;
        if (index < 0) index = 6;

        const newLetter = letters[index];

        // flip accidental
        let newAccidental = "";
        if (accidental === "#") newAccidental = "b";
        else if (accidental === "b") newAccidental = "#";

        return newLetter + newAccidental;
    };

    useEffect(() => {
        const held = new Set(); // tracks currently pressed keys

        const handle = (e) => {
            if (held.has(e.code)) return; // ignore if key is still held
            held.add(e.code);

            let sound = null;
            let note;

            if (e.key in whiteKeyLetters) {
                note = whiteKeys[whiteKeyLetters[e.key]];
                sound = new Audio(`/pianoNotes/${note.note}${4 + note.shift}.mp3`);
            } else if (e.key in blackKeyLetters) {
                note = blackKeys[blackKeyLetters[e.key]];
                sound = new Audio(`/pianoNotes/${note.note}${4 + note.shift}.mp3`);
            }

            if (!sound) return;

            //sound.volume = 0.25;

            // release reference after finished and remove from held
            sound.addEventListener("ended", () => {
                sound = null;
                held.delete(e.code); // now key can be played again
            });

            sound.play();

            if (!startedPlaying) {
                setStartedPlaying(true);
                setKeysPressed([`${note.note}${3 + note.shift}`]);
            }

            setKeysPressed(prev => {
                const updated = [...prev, `${note.note}${3 + note.shift}`];
                if (!startedPlaying) updated.pop();
                const notes = pieces[currentPieceIndex].notes;

                for (let i = 0; i < updated.length; i++) {
                    const expectedFull = notes[i];
                    const actualFull = updated[i];

                    // compare letters only
                    const expected = expectedFull.replace(/[0-9]/g, "").replace("n", "");
                    const actual = actualFull.replace(/[0-9]/g, "");

                    const sharped = changeNote(expected, true);
                    const flatted = changeNote(expected, false);

                    // check if actual matches expected OR ±1 note
                    if ((actual !== expected && (!expected.includes("#") && !expected.includes("b"))) || (actual !== expected && actual !== sharped && actual !== flatted && (expected.includes("#") || expected.includes("b")))) {
                        setCurrentPieceIndex(random(0, pieces.length - 1));
                        setKeysPressed([]);
                        setStartedPlaying(false);
                        return [];
                    }
                }

                if (updated.length === notes.length) {
                    setCompletedCaptcha(true);
                }

                return updated;
            });
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
    }, [blackKeyLetters, blackKeys, whiteKeyLetters, whiteKeys, startedPlaying, keysPressed, pieces, currentPieceIndex]);

    preloadSounds();
    let audioCtx;
    function unlockAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    const playSong = async () => {
        unlockAudio(); // must be inside same click

        //0-30
        let piece = currentPieceIndex;

        const sounds = pieces[piece].notes.map(n => {
            return new Audio(`/testNotes/${n.replace("n", "").replace("#", "sharp").replace(/\d+/g, match => String(Number(match) + 1))}.mp3`);
        });

        for (const audio of sounds) {
            audio.currentTime = 0;
            audio.play().catch(err => console.log(audio.src, err));
            await new Promise(res => setTimeout(res, pieces[piece].tempo));
        }
    }

    return (
        <>
            {!completedCaptcha && (
                <>
                    <h2>
                        Cannot verify if user is human. Please play {pieces[currentPieceIndex].name} on the piano below to prove you are not a robot. (Click on key with mouse to get help on what piece sounds like)
                    </h2>

                    <MusicStaff notes={pieces[currentPieceIndex].notes} />

                    <div style={containerStyle}>
                        <div style={pianoContainerStyle}>

                            {/* White keys */}
                            <div style={whiteKeysContainerStyle}>
                                {whiteKeys.map((key) => (
                                    <button
                                        key={key.id}
                                        style={whiteKeyStyle(activeKey === key.id)}
                                        onClick={playSong}
                                    >
                                        <span style={noteLabelStyle(false)}>{key.key}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Black keys */}
                            <div style={blackKeysContainerStyle}>
                                {blackKeys.map((key) => (
                                    <button
                                        key={key.id}
                                        style={blackKeyStyle(activeKey === key.id, key.position)}
                                        onClick={playSong}
                                    >
                                        <span style={noteLabelStyle(true)}>{key.key}</span>
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>
                </>
            )}

            {completedCaptcha && <h1>Successfully completed Captcha and can signup/login!</h1>}
        </>
    );

}