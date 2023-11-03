import React from "react";
import "./LoadingSpinner.scss";
interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "#0073e6",
}) => {
  const spinnerStyle: React.CSSProperties = {
    border: `4px solid ${color}`,
    borderTop: `4px solid transparent`,
    borderRadius: "50%",
    width: size,
    height: size,
    animation: "spin 2s linear infinite",
  };

  return (
    <>
      <div className="spinner-container">
        <div style={spinnerStyle} className="loading-spinner"></div>
      </div>
    </>
  );
};
export default LoadingSpinner;
