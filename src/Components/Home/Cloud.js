import React from "react";
import "./Home.css";

// Import all cloud SVGs
import cloud1 from "../../Media/Clouds/cloud-1.svg";
import cloud2 from "../../Media/Clouds/cloud-2.svg";
import cloud3 from "../../Media/Clouds/cloud-3.svg";
import cloud4 from "../../Media/Clouds/cloud-4.svg";
import cloud5 from "../../Media/Clouds/cloud-5.svg";
import cloud6 from "../../Media/Clouds/cloud-6.svg";
import cloud7 from "../../Media/Clouds/cloud-7.svg";
import cloud8 from "../../Media/Clouds/cloud-8.svg";
import cloud9 from "../../Media/Clouds/cloud-9.svg";
import cloud10 from "../../Media/Clouds/cloud-10.svg";
import cloud11 from "../../Media/Clouds/cloud-11.svg";
import cloud12 from "../../Media/Clouds/cloud-12.svg";

/**
 * Cloud component that renders a single animated cloud
 * 
 * This is a presentational component that receives animation properties from
 * the parent (Home.js). The parent generates random properties to create
 * varied, non-repetitive cloud animations.
 * 
 * CSS handles the actual animation (via @keyframes), while this component
 * just applies the dynamic properties (position, speed, delay).
 * 
 * @param {number} cloudNumber - Which cloud image to use (1-12)
 * @param {number} top - Vertical position in pixels
 * @param {number} speed - Animation duration in seconds
 * @param {number} delay - Start delay in seconds
 */
const Cloud = ({ cloudNumber, top, speed, delay }) => {
  // Map cloud numbers to imported SVG files
  // Using a lookup object is more efficient than conditional logic
  const cloudImages = {
    1: cloud1,
    2: cloud2,
    3: cloud3,
    4: cloud4,
    5: cloud5,
    6: cloud6,
    7: cloud7,
    8: cloud8,
    9: cloud9,
    10: cloud10,
    11: cloud11,
    12: cloud12,
  };

  const cloudSrc = cloudImages[cloudNumber];

  return (
    <img
      src={cloudSrc}
      alt={`Cloud ${cloudNumber}`}
      className="animated-cloud"
      // Inline styles for dynamic values (position, animation timing)
      // CSS class handles the animation keyframes
      style={{
        top: `${top}px`,
        animationDuration: `${speed}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

export default Cloud;

