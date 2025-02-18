import React from "react";

const Quantity = ({ increment, decrement, count }) => {
  return (
    <div className="flex gap-5 items-center rounded-lg p-2 font-bold">
      <button
        onClick={decrement}
        className="flex text-3xl items-center justify-center w-10 h-10 text-black   rounded-full"
      >
        -
      </button>
      <span className="text-xl">{count}</span>
      <button
        onClick={increment}
        className="flex items-center justify-center w-10 h-10 text-black  rounded-full"
      >
        +
      </button>
    </div>
  );
};

export default Quantity;
