import { useState, useEffect } from "react";
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

export const GuessTheNumber = () => {
    const [num, setNum] = useState(random(1, 100));
    const [text, setText] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [completed, setCompleted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const isTrue = parseInt(inputValue) === num;

        if (isTrue) {
            setCompleted(true);
            setIsAbleToAuthenticate(true);
            setText("You can authenticate!");
        } else {
            setNum(random(1, 100));
            setText("Try Again!");
            setInputValue("");
        }
    };

    const handleReset = () => {
        setCompleted(false);
        setNum(random(1, 100));
        setText("");
        setInputValue("");
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
                lineHeight: '1.5'
            }}>
                We couldn't verify you were human. Guess the number correctly between 1 and 100 to prove you're not a robot.
            </p>
            {text && (
                <span style={{ 
                    fontSize: '16px', 
                    textAlign: 'center',
                    fontWeight: text.includes("authenticate") ? '600' : '400',
                    color: text.includes("authenticate") ? '#008000' : '#000000'
                }}>
                    {text}
                </span>
            )}
            <form onSubmit={handleSubmit} style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <input 
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="form-input"
                    placeholder="Enter your guess"
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        border: '2px solid #000000',
                        borderRadius: '8px'
                    }}
                />
                <button 
                    type="submit"
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
                        marginTop: '35px',
                        opacity: inputValue.trim() ? 1 : 0.6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

