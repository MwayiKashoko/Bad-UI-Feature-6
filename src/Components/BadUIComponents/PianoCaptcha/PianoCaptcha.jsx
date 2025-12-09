import { useState, useEffect, useMemo } from "react";
import { setIsAbleToAuthenticate } from "../BadUIComponents";
import "../../Auth/Auth.css";

// Utility functions
const random = (min, max) => {
    return Math.floor((max - min + 1) * Math.random()) + min;
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
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
    }

    return (
        <div style={centeredStyle}>
            <svg width={staffWidth} height={staffHeight * measures.length + 100}>
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
                                        <text x={startX - 15} y={measureY + 15} fontSize="24" fontFamily="serif">4</text>
                                        <text x={startX - 15} y={measureY + 45} fontSize="24" fontFamily="serif">4</text>
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
    const [activeKey] = useState(null);
    const [startedPlaying, setStartedPlaying] = useState(false);
    const [keysPressed, setKeysPressed] = useState([]);
    const [completedCaptcha, setCompletedCaptcha] = useState(false);

    const handleReset = () => {
        setCompletedCaptcha(false);
        setCurrentPieceIndex(random(0, pieces.length - 1));
        setKeysPressed([]);
        setStartedPlaying(false);
        setIsAbleToAuthenticate(false);
    };

    const whiteKeys = useMemo(() => [
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
    ], []);

    const whiteKeyLetters = useMemo(() => ({
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
    }), []);

    const blackKeys = useMemo(() => [
        { note: 'Bb', id: -2, position: 0, key: "q", shift: -1 },
        { note: 'Db', id: 1, position: 2, key: "e", shift: 0 },
        { note: 'Eb', id: 3, position: 3, key: "r", shift: 0 },
        { note: 'Gb', id: 6, position: 5, key: "y", shift: 0 },
        { note: 'Ab', id: 8, position: 6, key: "u", shift: 0 },
        { note: 'Bb', id: 10, position: 7, key: "i", shift: 0 },
        { note: 'Db', id: 13, position: 9, key: "p", shift: 1 },
        { note: 'Eb', id: 15, position: 10, key: "[", shift: 1 },
    ], []);

    const blackKeyLetters = useMemo(() => ({
        "q": 0,
        "e": 1,
        "r": 2,
        "y": 3,
        "u": 4,
        "i": 5,
        "p": 6,
        "[": 7
    }), []);

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
    };

    const pianoContainerStyle = {
        position: 'relative',
        backgroundColor: 'white', // White background for piano area
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
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
        color: "black",
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
        left: `${position * 64}px`,
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

    const [currentPieceIndex, setCurrentPieceIndex] = useState(() => random(0, pieces.length - 1));

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
                    setIsAbleToAuthenticate(true);
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
        <div style={{ backgroundColor: '#4A90E2', minHeight: '100vh', padding: '20px' }}>
            {!completedCaptcha && (
                <>
                    <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
                        Cannot verify if user is human. Please play {pieces[currentPieceIndex].name} on the piano below to prove you are not a robot. (Click on key with mouse to get help on what piece sounds like)
                    </h2>

                    <div style={containerStyle}>
                        <MusicStaff notes={pieces[currentPieceIndex].notes} />

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

            {completedCaptcha && <CompletionCheckmark onReset={handleReset} />}
        </div>
    );
}

