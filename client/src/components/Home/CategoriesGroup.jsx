import React from "react";
import { useNavigate } from "react-router-dom";
import wearables from "../../assets/trendskart/categories/wearables.png";
import footwears from "../../assets/trendskart/categories/footwears.png";
import headsets from "../../assets/trendskart/categories/headsets.png";
import perfumes from "../../assets/trendskart/categories/perfumes.png";

const CategoriesGroup = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Watches",
      image: wearables,
      bgColor: "bg-gray-100",
    },
    {
      title: "Sneakers",
      image: footwears,
      bgColor: "bg-white",
    },
    {
      title: "Airpods",
      image: headsets,
      bgColor: "bg-purple-50",
    },
    {
      title: "Perfumes",
      image: perfumes,
      bgColor: "bg-green-50",
    },
  ];

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/collections?search=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <div className="py-8 px-4 sm:px-20 bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* First row: 1/4 and 3/4 width */}
        {categories.slice(0, 2).map((category, index) => (
          <div
            key={category.title}
            onClick={() => handleCategoryClick(category.title)}
            className={`cursor-pointer ${
              index === 0
                ? "col-span-1 sm:col-span-1 md:col-span-1"
                : "col-span-1 sm:col-span-1 md:col-span-3"
            } ${category.bgColor} rounded-lg overflow-hidden transition-transform hover:scale-[1.02] group`}
          >
            <div className="relative w-full">
              <h2 className="absolute top-5 left-4 text-2xl font-bold text-black z-10 group-hover:scale-105 transition-transform duration-300">
                {category.title}
              </h2>
              <div className="relative overflow-hidden rounded-md h-64 w-full">
                <img
                  src={category.image}
                  alt={`${category.title} category`}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Second row: 3/4 and 1/4 width */}
        {categories.slice(2, 4).map((category, index) => (
          <div
            key={category.title}
            onClick={() => handleCategoryClick(category.title)}
            className={`cursor-pointer ${
              index === 0
                ? "col-span-1 sm:col-span-1 md:col-span-3"
                : "col-span-1 sm:col-span-1 md:col-span-1"
            } ${category.bgColor} rounded-lg overflow-hidden transition-transform hover:scale-[1.02] group`}
          >
            <div className="relative w-full">
              <h2 className="absolute top-5 left-4 text-2xl font-bold text-black z-10 group-hover:scale-105 transition-transform duration-300 sm:bottom-4 sm:left-4 md:top-4 md:left-4">
                {category.title}
              </h2>
              <div className="relative overflow-hidden rounded-md h-64 w-full">
                <img
                  src={category.image}
                  alt={`${category.title} category`}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGroup;
