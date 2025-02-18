import React from "react";

const ProductCard = () => {
  return (
    <div className="max-w-[300px] text-center relative  ">
      <span className="absolute top-24 font-Inter left-2 bg-[#CC4254] px-2 py-1 text-xs text-[#FFFFFF] rounded-[5px]">
        Sale
      </span>
      <div className="mt-20 flex  mb-4 h-[375px] w-full rounded-[10px] border-[1px] border-[#CC4254]  bg-red-100" />
      <h3 className="text-[22px] ">Necklace</h3>
      <div className="flex justify-evenly items-center mt-3 font-Inter">

      <p className="text-sm line-through">₹3999.00</p>
      <p className="text-lg ">₹1999.00</p>
      </div>
    </div>
  );
};

export default ProductCard;