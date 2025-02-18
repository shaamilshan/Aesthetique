import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import sneakerImg from '../../assets/trendskart/categories/sneakers.jpeg';
import airpodsImg from '../../assets/trendskart/categories/airpodss.jpeg';
import smwatchImg from '../../assets/trendskart/categories/smartwatches.jpeg';
import crocsImg from '../../assets/trendskart/categories/crocs.jpeg';
import chappelImg from '../../assets/trendskart/categories/chappel.jpeg';
import gadgetsImg from '../../assets/trendskart/categories/gadgets.jpeg';
import sunglassesImg from '../../assets/trendskart/categories/sunglasses.jpeg';
import watchesImg from '../../assets/trendskart/categories/watches.jpeg';
import tshirtsImg from '../../assets/trendskart/categories/tshirts.jpeg';
import clothesImg from '../../assets/trendskart/categories/clothes.jpeg';
import premiumwatches from '../../assets/trendskart/categories/premiumwatches.jpeg';
import perfumesImg from '../../assets/trendskart/categories/perfumes.jpeg';
import bagsImg from '../../assets/trendskart/categories/bags.jpeg';
import chainwatches from '../../assets/trendskart/categories/chainwatches.jpeg';
import othersImg from '../../assets/trendskart/categories/others.jpeg';

const ShopCategories = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const scrollContainerRef = useRef(null);
  const dropdownRef = useRef(null);  // Ref for dropdown menu

  // Categories with IDs and images
  const categories = [
    { name: "Sneakers", id: "67497eb086528f9f86bbb8cf", image: sneakerImg },
    { name: "Airpods", id: "67497f8186528f9f86bbb920", image: airpodsImg },
    { name: "Smart Watches", id: "6749825b86528f9f86bbba2e", image: smwatchImg },
    { name: "Crocs", id: "674982e486528f9f86bbba50", image: crocsImg },
    { name: "Chappals", id: "6749851886528f9f86bbbaf2", image: chappelImg },
    { name: "Gadgets", id: "6749858586528f9f86bbbaf7", image: gadgetsImg },
    { name: "Sunglasses", id: "674986fd86528f9f86bbbb38", image: sunglassesImg },
    { name: "Watches", id: "6749876986528f9f86bbbb3c", image: watchesImg },
    { name: "T-Shirts", id: "6749895a86528f9f86bbbb5e", image: tshirtsImg },
    { name: "Clothes", id: "67498a9d86528f9f86bbbb7f", image: clothesImg },
    { name: "Premium Watches", id: "67498b3486528f9f86bbbba5", image: premiumwatches },
    { name: "Perfumes", id: "67498cd886528f9f86bbbbd1", image: perfumesImg },
    { name: "Bags", id: "6749bf0f86528f9f86bbbcd2", image: bagsImg },
    { name: "Chain Watches", id: "6759b62753eaed2411d501ed", image: chainwatches },
    { name: "Others", id: "6759bd5253eaed2411d502be", image: othersImg },
  ];

  // Dropdown options for navigation
  const dropdownOptions = {
    Sneakers: [
      { label: "7A Quality", id: "6763d1e053eaed2411d524a6" },
      { label: "10A Quality", id: "6763d1f053eaed2411d524aa" },
    ],
  };

  const toggleDropdown = (categoryName) => {
    setActiveDropdown((prev) => (prev === categoryName ? null : categoryName));
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setActiveDropdown(null); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-white py-4">
      {/* Scrollable Categories */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 justify-start items-center overflow-x-auto px-4 lg:gap-7 lg:px-8 lg:justify-start"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category) => (
          <div key={category.id} className="relative group">
            {/* Dynamic Route for Main Category */}
            <Link to={`/collections?category=${category.id}`}>
              <div className="flex flex-col items-center text-center justify-center bg-white rounded-lg min-w-[80px] h-28 p-2 hover:shadow-lg transition duration-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-contain rounded-t-lg"  // Ensures image fits properly
                />
                <span className="text-sm font-medium text-gray-700 mt-1">
                  {category.name}
                </span>
              </div>
            </Link>

            {/* Dropdown Indicator */}
            {dropdownOptions[category.name] && (
              <div
                className="absolute top-[76px] left-20 transform -translate-x-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
                onClick={() => toggleDropdown(category.name)}
              >
                <FiChevronDown />
              </div>
            )}

            {/* Dropdown Menu */}
            {activeDropdown === category.name && dropdownOptions[category.name] && (
              <div
                ref={dropdownRef}  // Attach ref to dropdown menu
                className="absolute top-[56px] left-0 w-40 bg-white border border-gray-300 shadow-lg rounded-md opacity-100 transition-opacity duration-200 z-50"
              >
                {dropdownOptions[category.name].map((option, idx) => (
                  <Link
                    key={idx}
                    to={`/collections?category=${option.id}`}
                    className="block px-4 py-[3px] text-[14px] text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCategories;
















// {
/* {categories.map((item, index) => {
        
        <li key={index}>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
            href={`/collections?category=${item._id}`}
          >
            {item.name}
          </Link>
        </li>;
      })} */
// }

/*
import React, { useEffect, useState } from "react";
import ProductCard3 from "../Cards/ProductCard3";
import axios from "axios";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

const ShopCategories = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const { data } = await axios.get(`${URL}/user/categories`, config);
    setCategories(data.categories);
    console.log(data.categories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="my-4 flex flex-col items-center w-full bg-[#CC4254] py-4 sm:rounded-[20px]">
      <h1 className="text-white text-[30px] my-6 text-center">
        Shop by Categories
      </h1>
      <div className="flex flex-wrap w-full items-center justify-center px-2">
        {categories.map((item, index) => {
          // Check if this is the last item and if there are 5 items
          const isLastItem =
            index === categories.length - 1 && categories.length % 2 !== 0;

          return (
            <div
              className={`p-2 ${
                isLastItem
                  ? "w-full pt-4 sm:pt-0 lg:w-1/5"
                  : "w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5"
              }`} // Last item takes full width if there are 5 items
              key={item._id}
            >
              <ProductCard3 item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopCategories;

{
  /* {categories.map((item, index) => {
        
        <li key={index}>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
            href={`/collections?category=${item._id}`}
          >
            {item.name}
          </Link>
        </li>;
      })} */
// }
