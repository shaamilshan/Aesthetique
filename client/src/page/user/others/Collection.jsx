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
    const { data } = await axios.get(`${URL}/user/categories`, config);
    setCategories(data.categories);
    console.log(data.categories);
  };
  useEffect(() => {
    loadCategories();
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
  }, [searchParams]);

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams();

    params.delete("category");
    params.delete("price");
    params.delete("search");
    params.delete("sort");
    params.delete("page");

    setSearchParams(params);

    setSearch("");
    setPrice("");
    setCategory([]);
    setPage(1);
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
      <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-md p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl  font-semibold">Filter & Sort</h2>
            <button onClick={onClose} className="text-gray-700">
              Close
            </button>
          </div>
          <div className="space-y-4">
            <div className="mt-4 space-y-2">
              <div className="flex items-center w-[300px] h-[60px] pl-4 bg-[#F2F2F2] rounded-[10px]">
                <FilterIcon />
                <h1 className="font-Inter text-[22px] ml-4">Filter</h1>
              </div>
              <DropDown
                title="price"
                text="Price"
                subItems={[
                  { name: "All Price", _id: "" },
                  { name: "Under 25000", _id: "Under 25000" },
                  { name: "25000-50000", _id: "25000-50000" },
                  { name: "50000-100000", _id: "50000-100000" },
                  { name: "Above 300000₹", _id: "Above 300000" },
                ]}
                onSubItemClick={handleSubItemClick}
              />
              <DropDownCheckbox
                title="category"
                text=" Type"
                filters={category}
                subItems={categories}
                onSubItemClick={handleClick}
              />
            </div>
            {/* <SortButton handleClick={handleClick} sort={sort} /> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full px-2 md:px-10 lg:px-20 flex flex-col justify-center">
        <div>
          <div className="flex flex-col md:flex-row min-h-screen mt-10">
            <aside className="w-full hidden lg:block md:w-80 bg-white overflow-y-auto py-6">
              <div className="mt-4 space-y-2">
                <div className="flex items-center w-[300px] h-[60px] pl-4 bg-[#F2F2F2] rounded-[10px]">
                  <FilterIcon />
                  <h1 className="font-Inter text-[22px] ml-4">Filter</h1>
                </div>
                <DropDown
                  title="price"
                  text="Price"
                  //change here filters
                  subItems={[
                    { name: "All Price", _id: "" }, 
                    { name: "Under 2500", _id: "Under 2500" },
                    { name: "25000-5000", _id: "2500-5000" },
                    { name: "5000-10000", _id: "5000-10000" },
                    { name: "Above 10000₹", _id: "Above 10000" },
                  ]}
                  onSubItemClick={handleSubItemClick}
                />
                <DropDownCheckbox
                  title="category"
                  text=" Type"
                  filters={category}
                  subItems={categories}
                  onSubItemClick={handleClick}
                />
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
              <div className="md:p-5">
                <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">
                  {/* <SearchBar
                    handleClick={handleClick}
                    search={search}
                    setSearch={setSearch}
                  /> */}
                  <div className="flex items-center justify-between">
                    <SortButton handleClick={handleClick} sort={sort} />
                    <div
                      className="mx-8 md:hidden"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FilterIcon />
                    </div>
                  </div>
                  <div className="shrink-0 hidden lg:block">
                    {userProducts.length}/{totalAvailableProducts} Results
                    Loaded
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-96">
                    <JustLoading size={10} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 py-5 m-4">
                    {userProducts && userProducts.length > 0 ? (
                      userProducts.map((pro, index) => (
                       
                        <ProductCard2
                          star
                          className="{w-[15%]}"
                          product={pro}
                          key={index}
                        />
                      ))
                    ) : (
                      <div className="h-96 flex justify-center items-center">
                        <p>No products found</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-center items-center mb-5">
                  <button
                    className={`px-4 py-2 border rounded ${
                      page === 1
                        ? "text-gray-400 border-gray-400 cursor-not-allowed"
                        : "text-blue-600 border-blue-600"
                    }`}
                    onClick={() => page > 1 && handleClick("page", page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-4">{page}</span>
                  <button
                    className={`px-4 py-2 border rounded ${
                      userProducts.length === 0
                        ? "text-gray-400 border-gray-400 cursor-not-allowed"
                        : "text-blue-600 border-blue-600"
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

      {/* Modal for filter and sort options */}
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
