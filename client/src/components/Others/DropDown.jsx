import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const DropDown = ({ title, text, subItems, onSubItemClick }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubItemClick = (subItem) => {
    console.log(subItem);
    setSelectedOption(subItem);
    onSubItemClick(title, subItem);
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
        <div className="pl-8">
          {subItems.map((item, index) => (
            <div
              key={index}
              className="py-2 cursor-pointer"
              onClick={() => handleSubItemClick(item._id)}
            >
              <input
                type="radio"
                className="mr-2"
                checked={selectedOption === item._id}
                onChange={() => handleSubItemClick(item._id)}
              />
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;

// //
// import { URL } from "@/Common/api";
// import { config } from "@/Common/configurations";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { RiArrowDropDownLine } from "react-icons/ri";

// const DropDown = ({ title, subItems, onSubItemClick }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [categories, setCategories] = useState([]);

//   const loadCategories = async () => {
//     const { data } = await axios.get(`${URL}/user/categories`, config);
//     setCategories(data.categories);
//     console.log(data.categories);
//   };
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const handleClick = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleSubItemClick = (subItem) => {
//     onSubItemClick(title, subItem);
//   };

//   return (
//     <div>
//       <div
//         className="flex items-center w-[300px] h-[60px] pl-4 justify-between border-b-[#5F5F5F] border-b-[0.5px] cursor-pointer"
//         onClick={handleClick}
//       >
//         <h1 className="font-Inter text-[20px] font-light ml-4">{title}</h1>
//         <RiArrowDropDownLine
//           className={`text-4xl font-[100] transition-transform duration-300 ${
//             isExpanded ? "rotate-180" : "rotate-0"
//           }`}
//         />
//       </div>
//       {isExpanded && (
//         <div className="pl-8">
//           {categories.map((item, index) => (
//             <div
//               key={index}
//               className="py-2 cursor-pointer"
//               onClick={() => handleSubItemClick(item._id)}
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DropDown;
