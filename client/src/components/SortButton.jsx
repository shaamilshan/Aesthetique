import React, { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

const SortButton = ({ sort, handleClick, filters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sort');

  const sortOptions = [
    { value: "", label: "New to Old", description: "Default sorting" },
    { value: "created-desc", label: "Old to New", description: "Oldest first" },
    { value: "price-asc", label: "Price: Low to High", description: "Cheapest first" },
    { value: "price-desc", label: "Price: High to Low", description: "Most expensive first" },
    { value: "name-asc", label: "Name: A to Z", description: "Alphabetical order" },
    { value: "name-desc", label: "Name: Z to A", description: "Reverse alphabetical" }
  ];

  const filterOptions = {
    categories: [
      { value: "skincare", label: "Skincare" },
      { value: "makeup", label: "Makeup" },
      { value: "wellness", label: "Wellness" },
      { value: "haircare", label: "Hair Care" }
    ],
    priceRanges: [
      { value: "Under 2500", label: "Under ₹2,500" },
      { value: "2500-5000", label: "₹2,500 - ₹5,000" },
      { value: "5000-10000", label: "₹5,000 - ₹10,000" },
      { value: "Above 10000", label: "Above ₹10,000" }
    ],
    availability: [
      { value: "in-stock", label: "In Stock" },
      { value: "out-of-stock", label: "Out of Stock" }
    ]
  };

  const handleOptionClick = (type, value) => {
    handleClick(type, value);
    if (type === 'sort') {
      setIsOpen(false);
    }
  };

  const selectedOption = sortOptions.find(option => option.value === sort) || sortOptions[0];
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category && filters.category.length > 0) count += filters.category.length;
    if (filters.price) count += 1;
    if (filters.availability && filters.availability.length > 0) count += filters.availability.length;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="relative lg:w-[500px] sm:w-[400px] w-[320px]">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-colors duration-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">Filter & Sort</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{selectedOption.label}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('sort')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'sort' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Sort
              </button>
              <button
                onClick={() => setActiveTab('filter')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'filter' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-h-80 overflow-y-auto">
              {activeTab === 'sort' ? (
                /* Sort Options */
                <div>
                  {sortOptions.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick('sort', option.value)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        index !== sortOptions.length - 1 ? 'border-b border-gray-100' : ''
                      } ${
                        sort === option.value ? 'bg-gray-100 border-l-4 border-l-black' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Filter Options */
                <div className="p-4 space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {filterOptions.categories.map(category => (
                        <label key={category.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.category && filters.category.includes(category.value)}
                            onChange={() => handleOptionClick('category', category.value)}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{category.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {filterOptions.priceRanges.map(priceRange => (
                        <label key={priceRange.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={filters.price === priceRange.value}
                            onChange={() => handleOptionClick('price', priceRange.value)}
                            className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{priceRange.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Availability</h4>
                    <div className="space-y-2">
                      {filterOptions.availability.map(availability => (
                        <label key={availability.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.availability && filters.availability.includes(availability.value)}
                            onChange={() => handleOptionClick('availability', availability.value)}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{availability.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        handleOptionClick('category', '');
                        handleOptionClick('price', '');
                        handleOptionClick('availability', '');
                      }}
                      className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortButton;
