import React, { useState, useEffect } from "react";
import "../Auth/Auth.css";

/**
 * Fake phone number login/signup component
 * Uses a slider to select phone number - styled like Auth forms
 * This is a fake UI element - submit doesn't do actual authentication
 */
const PhoneNumber = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("+1 (000) 000-0000");
  const [selectedValue, setSelectedValue] = useState(10000000000);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSliderChange = (e) => {
    const val = e.target.value.toString();
    setSelectedValue(val);
    
    // Format phone number as +1 (XXX) XXX-XXXX (US format only)
    // Extract last 10 digits from the value (skip the leading 1)
    const digits = val.substring(1).padStart(10, '0').substring(0, 10);
    const formatted = `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
    
    setPhoneNumber(formatted);
  };

  const resetToStart = () => {
    setPhoneNumber("+1 (000) 000-0000");
    setSelectedValue(10000000000);
    setIsSubmitted(false);
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        resetToStart();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div className="auth-form-container" style={{ width: "100%", maxWidth: "400px" }}>
        {isSubmitted ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            width: "100%"
          }}>
            <span style={{ 
              color: "#000", 
              fontSize: "80px",
              fontWeight: "bold"
            }}>✓</span>
          </div>
        ) : (
          <>
            <h1>Phone Input</h1>
            <p style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
              Use the slider to select your phone number
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-field">
                <label className="form-label">Phone Number</label>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "15px",
                  alignItems: "center",
                  padding: "10px 0"
                }}>
                  <input
                    type="range"
                    min="10000000000"
                    max="19999999999"
                    value={selectedValue}
                    onChange={handleSliderChange}
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "5px",
                      background: "#e0e0e0",
                      outline: "none",
                      cursor: "pointer",
                      WebkitAppearance: "none",
                      appearance: "none"
                    }}
                    className="phone-slider"
                  />
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--black)",
                    padding: "10px 0",
                    minHeight: "40px",
                    textAlign: "center"
                  }}>
                    {phoneNumber}
                  </div>
                </div>
              </div>
              
              <div className="form-field">
                <button type="submit" className="phone-submit-button">
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneNumber;

