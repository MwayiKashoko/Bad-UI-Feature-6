import { useState, useEffect } from "react";
import { generateRandomDateObject, setIsAbleToAuthenticate } from "../BadUIComponents";
import "../../Auth/Auth.css";

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

export const BirthdayGuesser = () => {
    const [earliestDate, setEarliestDate] = useState(new Date(1900, 1, 1));
    const [latestDate, setLatestDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(generateRandomDateObject(earliestDate, latestDate));
    const [completed, setCompleted] = useState(false);

    const handleEarlier = () => {
        const newLatest = currentDate;
        setLatestDate(newLatest);
        const newCurrent = generateRandomDateObject(earliestDate, newLatest);
        setCurrentDate(newCurrent);
    }

    const handleLater = () => {
        const newEarliest = currentDate;
        setEarliestDate(newEarliest);
        const newCurrent = generateRandomDateObject(newEarliest, latestDate);
        setCurrentDate(newCurrent);
    }

    const handleSubmit = () => {
        setCompleted(true);
        setIsAbleToAuthenticate(true);
    };

    const handleReset = () => {
        setCompleted(false);
        setEarliestDate(new Date(1900, 1, 1));
        setLatestDate(new Date());
        setCurrentDate(generateRandomDateObject(new Date(1900, 1, 1), new Date()));
        setIsAbleToAuthenticate(false);
    };

    if (completed) {
        return <CompletionCheckmark onReset={handleReset} />;
    }

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '700px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '20px',
        overflow: 'auto',
    };

    const titleStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: '10px',
        textAlign: 'center',
    };

    const instructionStyle = {
        fontSize: '16px',
        color: '#666666',
        marginBottom: '40px',
        textAlign: 'center',
    };

    const questionContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
    };

    const questionStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    };

    const dateStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000000',
    };

    const buttonStyle = {
        backgroundColor: '#000000',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        minWidth: '100px',
    };

    const submitButtonStyle = {
        width: '100%',
        maxWidth: '400px',
        padding: '12px 20px',
        height: '50px',
        fontSize: '18px',
        color: '#ffffff',
        border: '3px solid #000000',
        borderRadius: '10px',
        backgroundColor: '#000000',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: '"Zen Maru Gothic", sans-serif',
        marginTop: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div style={containerStyle}>
            <p style={instructionStyle}>Please enter your birthday by guessing earlier or later.</p>
            <div style={questionContainerStyle}>
                <button onClick={handleEarlier} style={buttonStyle}>Earlier</button>
                <div style={questionStyle}>
                    <div>Is this your birthday?</div>
                    <div style={dateStyle}>{currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
                </div>
                <button onClick={handleLater} style={buttonStyle}>Later</button>
            </div>
            <button onClick={handleSubmit} style={submitButtonStyle}>
                Submit
            </button>
        </div>
    );
}

