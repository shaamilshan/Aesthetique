import React from "react";

// Import all images
import sneakersImg from "../../assets/trendskart/categories/shoe.png";
import chappalsImg from "../../assets/trendskart/categories/sandal.jpg";
import perfumeImg from "../../assets/trendskart/categories/perfume.png";
import specsImg from "../../assets/trendskart/categories/spec.png";
import speakerImg from "../../assets/trendskart/categories/blutoothspeaker.png";
import tshirtImg from "../../assets/trendskart/categories/tshirt.png";
import jeansImg from "../../assets/trendskart/categories/jeans.png";
import watchImg from "../../assets/trendskart/categories/watch.png";
import airpodImg from "../../assets/trendskart/categories/airpod.png";
import airbudsImg from "../../assets/trendskart/categories/airbuds.jpg";
import headsetImg from "../../assets/trendskart/categories/headphone.png";
import earphonesImg from "../../assets/trendskart/categories/earphones.png";
import neckbandImg from "../../assets/trendskart/categories/neckbands.png";
import gadgetsImg from "../../assets/trendskart/categories/gadgets.png";

// Category data
const categories = [
  { name: "Sneakers", img: sneakersImg },
  { name: "Chappals", img: chappalsImg },
  { name: "Perfume", img: perfumeImg },
  { name: "Specs", img: specsImg },
  { name: "Speaker", img: speakerImg },
  { name: "Tshirt", img: tshirtImg },
  { name: "Jeans", img: jeansImg },
  { name: "Watch", img: watchImg },
  { name: "Airpod", img: airpodImg },
  { name: "Airbuds", img: airbudsImg },
  { name: "Headset", img: headsetImg },
  { name: "Earphones", img: earphonesImg },
  { name: "Neckband", img: neckbandImg },
  { name: "Gadgets", img: gadgetsImg },
];

// Component
const CategorySection = () => {
  return (
    <div className="relative bg-white p-2">
      {/* Gradient Overlay to indicate more items */}
      <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

      {/* Scrollable Category List */}
      <div
  className="flex gap-4 overflow-x-auto"
  style={{
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE & Edge
  }}
>
  <style>
    {`
      div::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
    `}
  </style>

        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-lg min-w-[100px] h-24 p-2 hover:shadow-lg transition duration-200"
          >
            <img
              src={category.img}
              alt={category.name}
              className="w-12 h-12 object-contain"
            />
            <span className="text-xs font-medium text-gray-700 mt-1">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
