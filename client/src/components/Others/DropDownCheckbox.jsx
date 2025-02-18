import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const DropDownCheckbox = ({
  title,
  text,
  subItems,
  onSubItemClick,
  filters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="flex items-center w-[300px] h-[60px] pl-4 justify-between border-b-[#5F5F5F] border-b-[0.5px] cursor-pointer"
        onClick={handleClick}
      >
        <h1 className="font-Inter text-[20px] font-light ml-4">{text}</h1>
        <RiArrowDropDownLine
          className={`text-4xl font-[100] transition-transform duration-300 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {isExpanded && (
        <div className="pl-8 mt-4 ">
          {subItems.map((item) => {
            return (
              <div className="mr-2 mb-2" key={item._id}>
                <input
                  type="checkbox"
                  name="category"
                  value={item._id}
                  checked={filters.includes(item._id)}
                  onChange={(e) => onSubItemClick("category", e.target.value)}
                />{" "}
                {item.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDownCheckbox;
