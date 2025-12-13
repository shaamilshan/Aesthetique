import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard2 from "@/components/Cards/ProductCard2";
import DropDown from "@/components/Others/DropDown";
import { getWishlist } from "@/redux/actions/user/wishlistActions";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import JustLoading from "@/components/JustLoading";
import { config } from "@/Common/configurations";
import { URL } from "@/Common/api";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import SortButton from "@/components/SortButton";
import DropDownCheckbox from "@/components/Others/DropDownCheckbox";

const Collections = () => {
  const { userProducts, loading, error, totalAvailableProducts } = useSelector(
    (state) => state.userProducts
  );
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000); // Price slider max value
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedSkinType, setSelectedSkinType] = useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });

    const categoryParam = searchParams.get("category");
    const priceParam = searchParams.get("price");
    const maxPriceParam = searchParams.get("maxPrice");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const ratingParam = searchParams.get("rating");
    const availabilityParam = searchParams.get("availability");
    const skinTypeParam = searchParams.get("skinType");
    const page = searchParams.get("page");

    setCategory(categoryParam ? categoryParam.split(",") : []);
    setPrice(priceParam || "");
    setMaxPrice(maxPriceParam ? parseInt(maxPriceParam) : 5000);
    setSort(sortParam || "");
    setSelectedRating(ratingParam ? ratingParam.split(",") : []);
    setSelectedAvailability(availabilityParam ? availabilityParam.split(",") : []);
    setSelectedSkinType(skinTypeParam ? skinTypeParam.split(",") : []);
    setPage(page || 1);
    setSearch(searchParam || "");
  }, [searchParams]);

  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/categories`, config);
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };
  
  useEffect(() => {
    loadCategories();
    
    // Set filter visibility based on screen width
    const handleResize = () => {
      setIsFilterVisible(window.innerWidth >= 1024); // Show filter by default on >= lg screens
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = (param, value) => {
    const params = new URLSearchParams(window.location.search);

    if (value === "" || (param === "page" && value === 1)) {
      params.delete(param);
      if (param === "price") {
        setPrice("");
      }

      if (param === "sort") {
        setSort("");
        params.delete("page");
        setPage(1);
      }
    } else {
      // Handle multi-select filters (category, rating, availability, skinType)
      if (["category", "rating", "availability", "skinType"].includes(param) && value) {
        let currentValues = params.get(param);
        let tempArray = currentValues ? currentValues.split(",") : [];
        
        if (tempArray.includes(value.toString())) {
          tempArray = tempArray.filter((item) => item !== value.toString());
        } else {
          tempArray.push(value.toString());
        }

        if (tempArray.length > 0) {
          params.set(param, tempArray.join(","));
        } else {
          params.delete(param);
        }

        // Update state based on param type
        if (param === "category") setCategory(tempArray);
        if (param === "rating") setSelectedRating(tempArray);
        if (param === "availability") setSelectedAvailability(tempArray);
        if (param === "skinType") setSelectedSkinType(tempArray);
        
        params.delete("page");
        setPage(1);
      } else if (param === "maxPrice") {
        // Handle price slider
        if (value === 5000) {
          params.delete("maxPrice");
        } else {
          params.set("maxPrice", value);
        }
        setMaxPrice(value);
        params.delete("page");
        setPage(1);
      } else {
        params.set(param, value);
        if (param === "price") {
          setPrice(value);
          params.delete("page");
          setPage(1);
        }

        if (param === "sort") {
          setSort(value);
          params.delete("page");
          setPage(1);
        }
        if (param === "search") {
          params.delete("page");
          setPage(1);
        }
      }
    }

    setSearchParams(params.toString() ? "?" + params.toString() : "");
    
    // Auto-close modal after selection on mobile
    if (window.innerWidth < 768) {
      setIsModalOpen(false);
    }
  };

  // Handle sub-item clicks
  const handleSubItemClick = (filterType, value) => {
    handleClick(filterType.toLowerCase(), value);
  };

  useEffect(() => {
    dispatch(getWishlist());
    dispatch(getUserProducts(searchParams));

    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams, dispatch]);

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams();

    setSearchParams(params);
    setSearch("");
    setPrice("");
    setCategory([]);
    setSelectedRating([]);
    setSelectedAvailability([]);
    setSelectedSkinType([]);
    setMaxPrice(5000);
    setPage(1);
  };

  // Mobile Filter toggle
  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Modal component
  const FilterSortModal = ({
    isOpen,
    onClose,
    handleClick,
    sort,
    category,
    categories,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-md p-4 rounded-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
            <h2 className="text-xl font-semibold">Filter & Sort</h2>
            <button 
              onClick={onClose} 
              className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-md"
            >
              Close
            </button>
          </div>
          <div className="space-y-4">
            <div className="mt-4 space-y-4">
              <div className="flex items-center h-[50px] pl-4 bg-[#F2F2F2] rounded-[10px]">
                {/* <FilterIcon /> */}
                <h1 className="font-Inter text-lg sm:text-xl ml-4">Filter Options</h1>
              </div>

              {/* By Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                        checked={category.includes(cat._id)}
                        onChange={(e) => handleClick('category', cat._id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Price</h3>
                <div className="space-y-4 px-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span className="font-semibold text-black">₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => handleClick('maxPrice', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-black"
                    style={{
                      background: `linear-gradient(to right, #000 0%, #000 ${(maxPrice / 5000) * 100}%, #e5e7eb ${(maxPrice / 5000) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="text-xs text-gray-500 text-center">
                    Showing products up to ₹{maxPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                      checked={selectedAvailability.includes('in-stock')}
                      onChange={(e) => handleClick('availability', 'in-stock')}
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                      checked={selectedAvailability.includes('out-of-stock')}
                      onChange={(e) => handleClick('availability', 'out-of-stock')}
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Reviews/Ratings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Review</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                        checked={selectedRating.includes(rating.toString())}
                        onChange={(e) => handleClick('rating', rating)}
                      />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                        <span className="text-xs text-gray-500">{rating} Star{rating > 1 ? 's' : ''}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* By Skin Type */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Skin Type</h3>
                <div className="space-y-2">
                  {['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'].map((skinType) => (
                    <label key={skinType} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                        checked={selectedSkinType.includes(skinType)}
                        onChange={(e) => handleClick('skinType', skinType)}
                      />
                      <span>{skinType}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <SortButton handleClick={handleClick} sort={sort} />
              </div>
              
              <div className="pt-4 flex justify-between">
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Clear All
                </button>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full px-2 sm:px-6 md:px-10 lg:px-20 flex flex-col justify-center">
        <div>
          <div className="flex flex-col md:flex-row min-h-screen mt-4 md:mt-6 lg:mt-10">
            {/* Sidebar filter - desktop */}
            <aside 
              className={`
                w-full lg:w-72 xl:w-80 bg-white overflow-y-auto 
                transition-all duration-300 ease-in-out
                ${isFilterVisible ? 'block' : 'hidden'} 
                lg:block 
                ${isFilterVisible && !isModalOpen ? 'fixed lg:static inset-0 z-40 p-4 bg-white' : ''}
              `}
            >
              {isFilterVisible && !isModalOpen && window.innerWidth < 1024 && (
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button 
                    onClick={toggleFilters} 
                    className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-md"
                  >
                    Close
                  </button>
                </div>
              )}
              
              <div className="mt-4 space-y-6 px-2">
                <div className="flex items-center h-[50px] pl-4 bg-[#F2F2F2] rounded-[10px]">
                  {/* <FilterIcon /> */}
                  <h1 className="font-Inter text-lg sm:text-xl ml-4">Filter Options</h1>
                </div>

                {/* By Categories */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                          checked={category.includes(cat._id)}
                          onChange={(e) => handleClick('category', cat._id)}
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

               

                {/* Price Range Slider */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Price</h3>
                  <div className="space-y-4 px-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span className="font-semibold text-black">₹{maxPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => handleClick('maxPrice', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-black"
                      style={{
                        background: `linear-gradient(to right, #000 0%, #000 ${(maxPrice / 5000) * 100}%, #e5e7eb ${(maxPrice / 5000) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="text-xs text-gray-500 text-center">
                      Showing products up to ₹{maxPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Reviews/Ratings */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Review</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                          checked={selectedRating.includes(rating.toString())}
                          onChange={(e) => handleClick('rating', rating)}
                        />
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                          <span className="text-xs text-gray-500">{rating} Star{rating > 1 ? 's' : ''}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">By Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                        checked={selectedAvailability.includes('in-stock')}
                        onChange={(e) => handleClick('availability', 'in-stock')}
                      />
                      <span>In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#A53030] focus:ring-[#A53030]"
                        checked={selectedAvailability.includes('out-of-stock')}
                        onChange={(e) => handleClick('availability', 'out-of-stock')}
                      />
                      <span>Out of Stock</span>
                    </label>
                  </div>
                </div>
                 
                {window.innerWidth < 1024 && (
                  <div className="pt-4 flex justify-between">
                    <button 
                      onClick={clearFilters}
                      className="px-4 py-2 bg-[#A53030] text-white rounded hover:bg-red-800 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Clear All
                    </button>
                    <button 
                      onClick={toggleFilters}
                      className="px-4 py-2 bg-[#A53030] text-white rounded hover:bg-red-800"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-2 sm:p-3 md:p-5">
                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {userProducts && userProducts.length > 0 ? `${(page - 1) * 12 + 1}-${Math.min(page * 12, totalAvailableProducts)}` : '0'} of {totalAvailableProducts || 0} results
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select 
                      value={sort}
                      onChange={(e) => handleClick('sort', e.target.value)}
                      className="border border-gray-300 rounded-full px-4 py-2 pr-10 text-sm appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A53030] custom-select"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px 16px'
                      }}
                    >
                      <option value="">Default Sorting</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Bar */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-gray-600">Active Filter:</span>
                  
                  {/* Price Range Filter */}
                  {maxPrice < 5000 && (
                    <div className="flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                      <span>₹0 - ₹{maxPrice}</span>
                      <button 
                        onClick={() => handleClick('maxPrice', 5000)}
                        className="ml-2 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Category Filters */}
                  {category.map((catId) => {
                    const cat = categories.find(c => c._id === catId);
                    return cat ? (
                      <div key={catId} className="flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                        <span>{cat.name}</span>
                        <button 
                          onClick={() => handleClick('category', catId)}
                          className="ml-2 text-white hover:text-gray-300"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}

                  {/* Rating Filters */}
                  {selectedRating.map((rating) => (
                    <div key={rating} className="flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                      <span>{rating} Star{rating > 1 ? 's' : ''}</span>
                      <button 
                        onClick={() => handleClick('rating', rating)}
                        className="ml-2 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Availability Filters */}
                  {selectedAvailability.map((availability) => (
                    <div key={availability} className="flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                      <span>{availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}</span>
                      <button 
                        onClick={() => handleClick('availability', availability)}
                        className="ml-2 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Skin Type Filters */}
                  {selectedSkinType.map((skinType) => (
                    <div key={skinType} className="flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                      <span>{skinType}</span>
                      <button 
                        onClick={() => handleClick('skinType', skinType)}
                        className="ml-2 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Sort Filter */}
                  {sort && (
                    <div className="flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                      <span>Sort: {sort.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                      <button 
                        onClick={() => handleClick('sort', '')}
                        className="ml-2 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Clear All Button */}
                  {(category.length > 0 || selectedRating.length > 0 || selectedAvailability.length > 0 || selectedSkinType.length > 0 || selectedPriceRanges.length > 0 || sort) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 underline hover:text-red-800 ml-2"
                    >
                      Clear All
                    </button>
                  )}

                  {/* Mobile Filter Button */}
                  <button
                    className="lg:hidden ml-auto flex items-center justify-center p-2 bg-gray-100 rounded-md"
                    onClick={toggleFilters}
                  >
                    <FilterIcon />
                    <span className="ml-2 text-sm">Filters</span>
                  </button>
                </div>

                {/* Products grid */}
                {loading ? (
                  <div className="flex justify-center items-center h-64 sm:h-80 md:h-96">
                    <JustLoading size={10} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 py-3">
                    {userProducts && userProducts.length > 0 ? (
                      userProducts.map((pro, index) => (
                        <ProductCard2
                          star
                          className="w-full"
                          product={pro}
                          key={index}
                        />
                      ))
                    ) : (
                      <div className="col-span-full h-48 sm:h-64 md:h-80 lg:h-96 flex flex-col justify-center items-center text-gray-500">
                        <p>No products found</p>
                        <button 
                          onClick={clearFilters}
                          className="mt-4 px-4 py-3 bg-[#A53030] text-white rounded-full hover:bg-red-600 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* Pagination - only show if more than one page */}
                {totalAvailableProducts > 12 && (
                  <div className="flex justify-center items-center my-6">
                    {page > 1 && (
                      <button
                        className="px-3 py-1 sm:px-4 sm:py-2 border rounded-full text-sm sm:text-base text-black border-black hover:bg-gray-100"
                        onClick={() => handleClick("page", page - 1)}
                      >
                        Previous
                      </button>
                    )}
                    <span className="mx-3 sm:mx-4 text-sm sm:text-base">Page {page}</span>
                    {userProducts && userProducts.length > 0 && page * 12 < totalAvailableProducts && (
                      <button
                        className="px-3 py-1 sm:px-4 sm:py-2 border rounded-full text-sm sm:text-base text-black border-black hover:bg-gray-100"
                        onClick={() => handleClick("page", page + 1)}
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Modal for filter and sort options on mobile */}
      <FilterSortModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleClick={handleClick}
        sort={sort}
        category={category}
        categories={categories}
      />
    </div>
  );
};

export default Collections;

const HomeIcon = ({ color }) => {
  return (
    <svg
      width="24"
      height="27"
      viewBox="0 0 24 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.24959 25.7504H8.21157V15.3074H15.7091V25.7504H22.6711V9.6843L11.9603 1.56198L1.24959 9.6843V25.7504ZM0 27V9.0595L11.9603 0L23.9207 9.0595V27H14.4595V16.557H9.46116V27H0Z"
        fill={color ? color : "#2C2C2C"}
      />
    </svg>
  );
};

const FilterIcon = () => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4286 25V17.1429H13.5714V20H25V22.1429H13.5714V25H11.4286ZM0 22.1429V20H7.85714V22.1429H0ZM5.71429 16.4286V13.5714H0V11.4286H5.71429V8.57143H7.85714V16.4286H5.71429ZM11.4286 13.5714V11.4286H25V13.5714H11.4286ZM17.1429 7.85714V0H19.2857V2.85714H25V5H19.2857V7.85714H17.1429ZM0 5V2.85714H13.5714V5H0Z"
        fill="#2C2C2C"
      />
    </svg>
  );
};

// Add CSS for range slider styling
const sliderStyles = `
.slider-thumb {
  pointer-events: none;
}

.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  pointer-events: auto;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #000000;
  cursor: grab;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  transition: all 0.2s ease;
}

.slider-thumb::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(0, 0, 0, 0.2);
}

.slider-thumb::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(0, 0, 0, 0.3);
}

.slider-thumb::-moz-range-thumb {
  pointer-events: auto;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #000000;
  cursor: grab;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  transition: all 0.2s ease;
}

.slider-thumb::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(0, 0, 0, 0.2);
}

.slider-thumb::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(0, 0, 0, 0.3);
}

.slider-thumb::-webkit-slider-track {
  background: transparent;
  border: none;
}

.slider-thumb::-moz-range-track {
  background: transparent;
  border: none;
}

/* Focus styles for accessibility */
.slider-thumb:focus::-webkit-slider-thumb {
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(0, 0, 0, 0.4);
}

.slider-thumb:focus::-moz-range-thumb {
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(0, 0, 0, 0.4);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = sliderStyles;
  document.head.appendChild(styleSheet);
}