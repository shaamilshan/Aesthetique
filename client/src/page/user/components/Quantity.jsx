import React from "react";

const Quantity = ({ increment, decrement, count }) => {
  return (
    <div className="flex gap-5 items-center rounded-lg  justify-center border font-bold">
      <button
        onClick={decrement}
        className="flex text-3xl border items-center justify-center w-10 h-10 text-black "
      >
        -
      </button>
      <span className="text-xl">{count}</span>
      <button
        onClick={increment}
        className="flex items-center border justify-center w-10 h-10 text-black "
      >
        +
      </button>
    </div>
  );
};

export default Quantity;
