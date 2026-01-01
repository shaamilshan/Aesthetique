import React from "react";

const Quantity = ({ increment, decrement, count, minimal = false }) => {
  if (minimal) {
    return (
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={decrement}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors rounded-l-lg"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-10 text-center text-sm font-medium">{count}</span>
        <button
          onClick={increment}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors rounded-r-lg"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    // Left-align on small screens, keep centered on sm+ screens
    <div className="flex gap-4 items-center justify-start sm:justify-center">
      <button
        onClick={decrement}
        className="flex items-center justify-center w-10 h-10 text-black hover:text-gray-600 transition-colors duration-200 text-xl font-medium"
      >
        -
      </button>
  <span className="text-xl font-medium min-w-[2rem] text-left">{count}</span>
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
