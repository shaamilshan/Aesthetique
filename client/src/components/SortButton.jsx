import React from "react";

const SortButton = ({ sort, handleClick }) => {
  const handleChange = (sort, value) => {
    handleClick(sort, value);
  };

  return (
    <div className="lg:w-[406px]  sm:w-[300px] w-[250px] h-[50px] lg:h-[74px] font-[300]  flex items-center border-[#9F9F9F] rounded-[10px]">
      <div className="w-1/3 text-center sm:text-[20px]  text-[15px] font-Inter font-bold border-r-[1px]  border-[#9F9F9F]">
        Sort by:
      </div>
      <div className="w-3/5 px-4">
        <select
          className="bg-white w-full font-Inter sm:text-[20px] text-[15px] outline-none"
          value={sort}
          onChange={(e) => handleChange("sort", e.target.value)}
        >
          <option className="rounded shadow-md" value="">
            New to Old
          </option>
          <option value="created-desc">Old to New</option>
          <option value="price-asc">Low to High</option>
          <option value="price-desc">High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SortButton;
