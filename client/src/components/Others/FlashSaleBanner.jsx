import React from "react";

const FlashSaleBanner = () => {
  return (
    <div className="w-full min-h-32 h-[150px] bg-[#FFEFF1]">
      <div className="flex overflow-hidden py-2 w-full h-full items-center text-center justify-center">
        <img
          src={
            "https://raw.githubusercontent.com/sreenath256/Helah/master/src/assets/DiamondVector.png"
          }
          alt=""
        />
        <span className="text-[#CC4254] text-3xl sm:text-7xl m-4 ">
          FLASH SALE UP TO 20% OFF
        </span>
        <img
          src={
            "https://raw.githubusercontent.com/sreenath256/Helah/master/src/assets/DiamondVector.png"
          }
          alt=""
        />
      </div>
    </div>
  );
};

export default FlashSaleBanner;

function DiamondIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
    </svg>
  );
}
