import React from "react";

const CategoryRadioButton = ({ buttonName }) => {
  return (
    <div className="font-Inter my-3">
      <input id={buttonName} name="collection" className="accent-[#C84253] border-2 bg-[#C84253]" type="radio" />
      <label className="text-[16px] ml-2 text-[#2C2C2C]" htmlFor={buttonName}>
        {buttonName ? buttonName : "American Diamond"}
      </label>
    </div>
  );
};

export default CategoryRadioButton;