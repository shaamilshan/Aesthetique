import React from "react";

// Import your images
import WearablesImage from "../../assets/trendskart/categories/wearables.png"; // Update with your correct image paths
import FootwearsImage from "../../assets/trendskart/categories/footwears.jpg";
import HeadsetsImage from "../../assets/trendskart/categories/headsets.jpg";
import PerfumesImage from "../../assets/trendskart/categories/perfumes.jpg";

const CategoryGrid = () => {
  const categories = [
    { title: "Wearables", image: WearablesImage },
    { title: "Footwears", image: FootwearsImage },
    { title: "Headsets", image: HeadsetsImage },
    { title: "Perfumes", image: PerfumesImage },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {categories.map((category, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <h2 className="text-white text-lg md:text-xl font-semibold">
              {category.title}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
