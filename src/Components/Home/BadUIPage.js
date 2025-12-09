import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as badUI from "../BadUIComponents/BadUIComponents";
import { setIsAbleToAuthenticate, isAbleToAuthenticate } from "../BadUIComponents/BadUIComponents";
import { getComponentDisplayName } from "../BadUIComponents/BadUIComponents";
import "../Auth/Auth.css";

/**
 * Simple wrapper component for displaying bad UI pages
 * Removes authentication requirements - just displays the component
 */
const BadUIPage = () => {
  const { componentName } = useParams();

  // Reset auth flag when component mounts to ensure clean state
  // This prevents stale authentication state from persisting between component mounts
  useEffect(() => {
    setIsAbleToAuthenticate(false);
  }, []);

  // Monitor authentication state to toggle title visibility
  // When user completes a CAPTCHA challenge, isAbleToAuthenticate becomes true
  // and the title should hide to show the completion checkmark
  // Using interval polling ensures immediate UI updates when state changes
  // outside React's render cycle (e.g., from BadUIComponents internal state)
  useEffect(() => {
    // Poll for changes at 60fps for smooth, responsive UI updates
    // This is necessary because isAbleToAuthenticate may change outside React's lifecycle
    const interval = setInterval(() => {
      // Force re-render by checking state (component will re-render naturally)
    }, 16);

    return () => clearInterval(interval);
  }, []); // Run once on mount - polling doesn't need dependencies

  // Calculate title visibility based on current authentication state
  // This provides immediate feedback during render without waiting for useEffect
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
            {getComponentDisplayName(componentName)}
          </h1>
        )}
        <Component {...props} />
      </div>
    </div>
  );
};

export default BadUIPage;

