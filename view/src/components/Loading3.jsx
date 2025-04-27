/* eslint-disable react/prop-types */
import { useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";

const Loader3 = ({ bg }) => {
  const { theme } = useContext(ThemeContext) || { theme: "light" }; 
  const strokeColor = bg || theme === "dark" ? "#ffffff" : "#000000";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="30" 
      height="30" 
      style={{
        shapeRendering: "auto",
        display: "block",
      }}
    >
      <g>
        <circle
          strokeDasharray="164.93361431346415 56.97787143782138"
          r="35"
          strokeWidth="10"
          stroke={strokeColor}
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="1s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          />
        </circle>
        <g></g>
      </g>
    </svg>
  );
};

export default Loader3;
