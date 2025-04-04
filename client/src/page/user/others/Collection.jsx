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

  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });

    const categoryParam = searchParams.get("category");
    const priceParam = searchParams.get("price");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const page = searchParams.get("page");

    setCategory(categoryParam ? categoryParam.split(",") : []);
    setPrice(priceParam || "");
    setSort(sortParam || "");
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
      if (param === "category" && value) {
        let cat = params.get("category");
        if (!cat) {
          params.append("category", value);
          setCategory([value]);
        } else {
          let temp = cat.split(",");
          if (temp.length > 0) {
            if (temp.includes(value)) {
              temp = temp.filter((item) => item !== value);
            } else {
              temp.push(value);
            }

            if (temp.length > 0) {
              params.set("category", temp.join(","));
              setCategory(temp);
            } else {
              params.delete("category");
              setCategory([]);
            }
          } else {
            params.delete("category");
            setCategory([]);
          }
        }
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
            <div className="mt-4 space-y-2">
              <div className="flex items-center h-[50px] pl-4 bg-[#F2F2F2] rounded-[10px]">
                <FilterIcon />
                <h1 className="font-Inter text-lg sm:text-xl ml-4">Filter</h1>
              </div>
              <DropDown
                title="price"
                text="Price"
                subItems={[
                  { name: "All Price", _id: "" },
                  { name: "Under 2500", _id: "Under 2500" },
                  { name: "2500-5000", _id: "2500-5000" },
                  { name: "5000-10000", _id: "5000-10000" },
                  { name: "Above 10000₹", _id: "Above 10000" },
                ]}
                onSubItemClick={handleSubItemClick}
              />
              <DropDownCheckbox
                title="category"
                text="Type"
                filters={category}
                subItems={categories}
                onSubItemClick={handleClick}
              />
              
              <div className="pt-4 border-t mt-4">
                <SortButton handleClick={handleClick} sort={sort} />
              </div>
              
              <div className="pt-4 flex justify-between">
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
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
              
              <div className="mt-4 space-y-4 px-2">
                <div className="flex items-center h-[50px] pl-4 bg-[#F2F2F2] rounded-[10px]">
                  <FilterIcon />
                  <h1 className="font-Inter text-lg sm:text-xl ml-4">Filter</h1>
                </div>
                <DropDown
                  title="price"
                  text="Price"
                  subItems={[
                    { name: "All Price", _id: "" },
                    { name: "Under 2500", _id: "Under 2500" },
                    { name: "2500-5000", _id: "2500-5000" },
                    { name: "5000-10000", _id: "5000-10000" },
                    { name: "Above 10000₹", _id: "Above 10000" },
                  ]}
                  onSubItemClick={handleSubItemClick}
                />
                <DropDownCheckbox
                  title="category"
                  text="Category"
                  filters={category}
                  subItems={categories}
                  onSubItemClick={handleClick}
                />
                
                {window.innerWidth < 1024 && (
                  <div className="pt-4 flex justify-between">
                    <button 
                      onClick={clearFilters}
                      className="px-4 py-2 bg-[#A53030] text-white rounded hover:bg-red-800"
                    >
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
                {/* Top controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center">
                    <button
                      className="lg:hidden flex items-center justify-center p-2 bg-gray-100 rounded-md mr-3"
                      onClick={toggleFilters}
                    >
                      <FilterIcon />
                      <span className="ml-2">Filters</span>
                    </button>
                    <SortButton handleClick={handleClick} sort={sort} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Clear Filters
                    </button>
                    <div className="shrink-0 text-sm">
                      <span className="hidden sm:inline">{userProducts?.length || 0}/{totalAvailableProducts || 0} Results</span>
                      <span className="sm:hidden">{userProducts?.length || 0}/{totalAvailableProducts || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Products grid */}
                {loading ? (
                  <div className="flex justify-center items-center h-64 sm:h-80 md:h-96">
                    <JustLoading size={10} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 py-3">
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
                          className="mt-4 px-4 py-2 bg-[#A53030] text-white rounded hover:bg-red-600"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center items-center my-6">
                  <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 border rounded text-sm sm:text-base ${
                      page === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-red-600 border-red-500 hover:bg-blue-50"
                    }`}
                    onClick={() => page > 1 && handleClick("page", page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-3 sm:mx-4 text-sm sm:text-base">Page {page}</span>
                  <button
                    className={`px-3 py-1 sm:px-4 sm:py-2 border rounded text-sm sm:text-base ${
                      userProducts.length === 0
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-red-600 border-red-500 hover:bg-blue-50"
                    }`}
                    onClick={() =>
                      userProducts.length > 0 && handleClick("page", page + 1)
                    }
                    disabled={userProducts.length === 0}
                  >
                    Next
                  </button>
                </div>
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