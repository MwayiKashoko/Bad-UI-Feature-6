import React, { useState, useEffect, useCallback } from "react";
import "../Auth/Auth.css";

/**
 * Helper function to generate a random date between two dates
 */
const generateRandomDateObject = (earliestDate, latestDate) => {
  const earliest = earliestDate.getTime();
  const latest = latestDate.getTime();
  const randomTime = earliest + Math.random() * (latest - earliest);
  return new Date(randomTime);
};

/**
 * Birthday guesser component - binary search style birthday input
 * Uses Earlier/Later buttons to narrow down the birthday
 * This is a fake UI element - submit doesn't do actual authentication
 */
const Birthday = ({ onClose }) => {
  const initialEarliest = new Date(1900, 0, 1);
  const initialLatest = new Date();
  
  const [earliestDate, setEarliestDate] = useState(initialEarliest);
  const [latestDate, setLatestDate] = useState(initialLatest);
  const [currentDate, setCurrentDate] = useState(() => 
    generateRandomDateObject(initialEarliest, initialLatest)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEarlier = () => {
    const newLatest = new Date(currentDate);
    setLatestDate(newLatest);
    setCurrentDate(generateRandomDateObject(earliestDate, newLatest));
  };

  const handleLater = () => {
    const newEarliest = new Date(currentDate);
    setEarliestDate(newEarliest);
    setCurrentDate(generateRandomDateObject(newEarliest, latestDate));
  };

  const resetToStart = useCallback(() => {
    const resetEarliest = new Date(1900, 0, 1);
    const resetLatest = new Date();
    setEarliestDate(resetEarliest);
    setLatestDate(resetLatest);
    setCurrentDate(generateRandomDateObject(resetEarliest, resetLatest));
    setIsSubmitted(false);
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        resetToStart();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, resetToStart]);

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
            <h1>Birthday Input</h1>
            <p style={{ marginBottom: "30px", fontSize: "14px", color: "#666" }}>
              Please enter your birthday by guessing earlier or later
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-field">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                  justifyContent: "center",
                  marginBottom: "20px"
                }}>
                  <button 
                    type="button"
                    onClick={handleEarlier}
                    style={{
                      padding: "6px 15px",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor: "var(--black)",
                      color: "var(--white)",
                      border: "2px solid var(--black)",
                      borderRadius: "5px",
                      fontWeight: "600"
                    }}
                  >
                    Earlier
                  </button>
                  <div style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--black)",
                    textAlign: "center"
                  }}>
                    Is this your birthday? {currentDate.toLocaleDateString()}
                  </div>
                  <button 
                    type="button"
                    onClick={handleLater}
                    style={{
                      padding: "6px 15px",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor: "var(--black)",
                      color: "var(--white)",
                      border: "2px solid var(--black)",
                      borderRadius: "5px",
                      fontWeight: "600"
                    }}
                  >
                    Later
                  </button>
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

export default Birthday;

