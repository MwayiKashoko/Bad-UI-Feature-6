import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as badUI from "../BadUIComponents/BadUIComponents";
import { setIsAbleToAuthenticate, isAbleToAuthenticate } from "../BadUIComponents/BadUIComponents";
import "../Auth/Auth.css";

/**
 * Simple wrapper component for displaying bad UI pages
 * Removes authentication requirements - just displays the component
 */
const BadUIPage = () => {
  const { componentName } = useParams();
  const [showTitle, setShowTitle] = useState(true);

  // Reset auth flag when component mounts
  useEffect(() => {
    setIsAbleToAuthenticate(false);
    setShowTitle(true);
  }, []);

  // Check if checkmark is showing (when isAbleToAuthenticate becomes true, checkmark shows)
  // Check on every render and also with interval for immediate updates
  useEffect(() => {
    setShowTitle(!isAbleToAuthenticate);
    
    const interval = setInterval(() => {
      setShowTitle(!isAbleToAuthenticate);
    }, 16); // ~60fps for smooth updates

    return () => clearInterval(interval);
  });

  // Also check on every render
  const shouldShowTitle = !isAbleToAuthenticate;

  // Map component names to actual components
  const componentMap = {
    "PhoneNumberRange": badUI.PhoneNumberRange,
    "BirthdayGuesser": badUI.BirthdayGuesser,
    "MathCAPTCH": badUI.SimpleMathQuestion,
    "GuessTheNumber": badUI.GuessTheNumber,
    "TetrisMasterMode": badUI.TetrisGame,
    "TetrisInvisibleMode": badUI.TetrisGame,
    "TetrisSprint": badUI.TetrisGame,
    "TetrisFast": badUI.TetrisGame,
    "TetrisMarathon": badUI.TetrisGame,
    "MarioGame": badUI.MarioGame,
    "PianoPieces": badUI.PianoPieces,
  };

  const Component = componentMap[componentName];

  if (!Component) {
    return (
      <div className="auth-page-container">
        <Link to="/" className="back-to-home-button">
          Back to Home
        </Link>
        <div className="auth-form-container">
          <h2>Bad UI component not found: {componentName}</h2>
          <p>Available components: {Object.keys(componentMap).join(", ")}</p>
        </div>
      </div>
    );
  }

  // For components that need props, provide dummy data
  const props = {};
  if (componentName.startsWith("Tetris")) {
    props.ui = { uiFeature: componentName };
    props.user = {}; // Dummy user object
  } else if (componentName === "MarioGame") {
    props.ui = { uiFeature: "CompleteEasyMarioLevel" };
    props.user = {}; // Dummy user object
  } else if (componentName === "MathCAPTCH") {
    props.user = { password: "" }; // Dummy user object
  }

  return (
    <div className="auth-page-container">
      <Link to="/" className="back-to-home-button">
        Back to Home
      </Link>
      <div 
        className="auth-form-container"
        style={
          componentName === "BirthdayGuesser" 
            ? { width: '500px' } 
            : componentName.startsWith("Tetris")
            ? { width: 'auto', paddingLeft: '30px', paddingRight: '30px' }
            : componentName === "MathCAPTCH"
            ? { width: '500px', paddingLeft: '30px', paddingRight: '30px' }
            : {}
        }
      >
        {shouldShowTitle && (
          <h1>
            {componentName === "BirthdayGuesser" 
              ? "Birthday Input" 
              : componentName === "PhoneNumberRange"
              ? "Phone Input"
              : componentName === "MathCAPTCH"
              ? "Math CAPTCHA"
              : componentName === "GuessTheNumber"
              ? "Number Guesser CAPTCHA"
              : componentName === "TetrisMasterMode"
              ? "Tetris CAPTCHA (Master)"
              : componentName === "TetrisInvisibleMode"
              ? "Tetris CAPTCHA (Invisible)"
              : componentName === "TetrisSprint"
              ? "Tetris CAPTCHA (Sprint)"
              : componentName === "TetrisFast"
              ? "Tetris CAPTCHA (Fast)"
              : componentName === "TetrisMarathon"
              ? "Tetris CAPTCHA (Marathon)"
              : componentName === "MarioGame"
              ? "Mario CAPTCHA"
              : componentName === "PianoPieces"
              ? "Piano CAPTCHA"
              : componentName.replace(/([A-Z])/g, " $1").trim()}
          </h1>
        )}
        <Component {...props} />
      </div>
    </div>
  );
};

export default BadUIPage;

