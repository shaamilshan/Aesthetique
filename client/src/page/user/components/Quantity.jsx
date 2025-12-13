import React from "react";

const Quantity = ({ increment, decrement, count }) => {
  return (
    <div className="flex gap-4 items-center justify-center">
      <button
        onClick={decrement}
        className="flex items-center justify-center w-10 h-10 text-black hover:text-gray-600 transition-colors duration-200 text-xl font-medium"
      >
        -
      </button>
      <span className="text-xl font-medium min-w-[2rem] text-center">{count}</span>
      <button
        onClick={increment}
        className="flex items-center justify-center w-10 h-10 text-black hover:text-gray-600 transition-colors duration-200 text-xl font-medium"
      >
        +
      </button>
    </div>
  );
};

export default Quantity;
