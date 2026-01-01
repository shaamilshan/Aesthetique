import React from "react";
import bmLogo from "@/assets/others/bm-logo.png";

const JustLoading = ({ size = 10 }) => {
  // Convert size to pixels (size * 8 for scaling)
  const sizeInPx = size * 8;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0.3;
              transform: scale(0.95);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .logo-fade {
            animation: fadeInOut 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <img
        src={bmLogo}
        alt="Loading..."
        style={{ width: sizeInPx, height: 'auto' }}
        className="logo-fade object-contain"
      />
    </div>
  );
};

export default JustLoading;
