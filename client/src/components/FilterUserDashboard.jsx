import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import axios from "axios";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";

const FilterUserDashboard = ({ filters, price, handleClick, clearFilters }) => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/categories`, config);
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="lg:w-1/5 bg-white p-5 mr-4 rounded-xl shadow-md">
      <ul className="space-y-4">
        {/* Category Filter */}
        <li className="text-lg font-medium border-b pb-2">Category</li>
        <div className="space-y-2">
          {categories.map((item) => (
            <li key={item._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="category"
                value={item._id}
                checked={filters.includes(item._id)}
                onChange={(e) => handleClick("category", e.target.value)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">{item.name}</span>
            </li>
          ))}
        </div>

        {/* Price Filter */}
        <li className="text-lg font-semibold border-b pb-2">Price Range</li>
        <div className="space-y-2">
          {[
            { label: "All Price", value: "" },
            { label: "Under 25000₹", value: "Under 25000" },
            { label: "25000₹ - 50000₹", value: "25000-50000" },
            { label: "50000₹ - 100000₹", value: "50000-100000" },
            { label: "100000₹ - 150000₹", value: "100000-150000" },
            { label: "200000₹ - 300000₹", value: "200000-300000" },
            { label: "Above 300000₹", value: "Above 300000" },
          ].map((item) => (
            <li key={item.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="priceRange"
                value={item.value}
                checked={price === item.value}
                onChange={(e) => handleClick("price", e.target.value)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">{item.label}</span>
            </li>
          ))}
        </div>

        {/* Clear Filters Button */}
        <li className="pt-4">
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 px-4 py-2 rounded-md font-semibold transition"
          >
            <BiTrash className="text-lg" />
            <span className="text-sm">Clear All Filters</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default FilterUserDashboard;
