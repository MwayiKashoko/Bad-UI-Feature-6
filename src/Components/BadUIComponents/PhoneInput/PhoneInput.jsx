import { useState, useEffect } from "react";
import { setIsAbleToAuthenticate } from "../BadUIComponents";
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

export const PhoneNumberRange = () => {
    const [phoneNumber, setPhoneNumber] = useState("+1 (000) 000-0000");
    const [completed, setCompleted] = useState(false);

    const handleChange = (e) => {
        const val = e.target.value;
        // Convert slider value to phone number format
        const numStr = val.toString().padStart(10, '0');
        const formatted = `+1 (${numStr.substring(0, 3)}) ${numStr.substring(3, 6)}-${numStr.substring(6, 10)}`;
        setPhoneNumber(formatted);
    };

    const handleSubmit = () => {
        setCompleted(true);
        setIsAbleToAuthenticate(true);
    };

    const handleReset = () => {
        setCompleted(false);
        setPhoneNumber("+1 (000) 000-0000");
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

    const labelStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: '10px',
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: '800px',
    };

    const sliderStyle = {
        width: '100%',
        maxWidth: '800px',
        marginBottom: '20px',
    };

    const phoneDisplayStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginTop: '10px',
    };

    return (
        <div style={containerStyle}>
            <p style={instructionStyle}>Use the slider to select your phone number</p>
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label style={labelStyle}>Phone Number</label>
                <input 
                    type='range' 
                    min="0" 
                    max="9999999999" 
                    defaultValue="0"
                    onChange={handleChange}
                    className="phone-slider"
                    style={sliderStyle}
                />
            </div>
            <div style={phoneDisplayStyle}>{phoneNumber}</div>
            <button 
                onClick={handleSubmit}
                style={{
                    width: '100%',
                    maxWidth: '800px',
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
                }}
            >
                Submit
            </button>
        </div>
    );
}

