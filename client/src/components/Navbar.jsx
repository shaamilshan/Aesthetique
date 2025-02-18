// import React from "react";

// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav>
//       <div className="bg-white px-2 sm:px-4 py-2.5 h-[120px] w-full border-[0.5px] border-[#C0C0C0] rounded dark:bg-gray-800">
//         <div className="container flex flex-nowrap justify-between w-full h-full items-center ">
//           <div className="flex w-1/2  h-full items-center justify-start  bg-contain bg-no-repeat bg-center ">
//             <Link to='/'>
//             <img
//               alt="Logo"
//               width={"100%"}
//               height={"100%"}
//               className="object-contain  sm:h-9 lg:w-[250px] w-[150px] "
//               src={
//                 "https://raw.githubusercontent.com/sreenath256/Helah/master/src/assets/CompanyLogo.png"
//               }
//               />
//               </Link>
//           </div>
//           <div className=" flex md:order-2 w-1/2 ">
//             <div className="hidden  md:flex w-full md:justify-end  items-center ">
//               <div className="flex w-72 bg-[#F5F5F5] rounded-3xl  items-center  pl-5 border-[0.5px] border-[#D0D0D0]">
//                 <SearchIcon className="text-gray-700" />

//                 <input
//                   className="flex h-10 w-full rounded-md border border-slate-200  px-3 py-2 text-sm ring-offset-white bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none w-72 font-sans text-[#9A9A9A]"
//                   placeholder="Search for"
//                   type="search"
//                 />
//               </div>
//               <div className="pl-5">
//                 <HeartIcon className="text-gray-700 ml-7 pl-5" />
//               </div>
//               <div className="pl-5">
//                 <UserIcon className="text-gray-700 ml-7 pl-5" />
//               </div>
//               <div className="pl-5">
//                 <ShoppingBagIcon className="text-gray-700 ml-4 " />
//               </div>
//             </div>
//             <button
//               aria-controls="mobile-menu-2"
//               aria-expanded="false"
//               className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//               data-collapse-toggle="mobile-menu-2"
//               type="button"
//             >
//               <span className="sr-only">Open main menu</span>
//               <MenuIcon className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center items-center h-16 bg-[#F6F6F6]">
//         <div
//           className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
//           id="mobile-menu-2"
//         >
//           <ul className="flex flex-col mt-4  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-normal">
//             <li>
//               <a
//                 aria-current="page"
//                 className="block py-2  pr-4 pl-3 text-xl text-[#2C2C2C] rounded md:bg-transparent md:p-0 dark:text-white"
//                 href="#"
//               >
//                 <Link to="/abs">New Arrivals</Link>
//               </a>
//             </li>
//             <li>
//               <a
//                 className="block py-2 pr-4 pl-3  text-xl text-[#2C2C2C] rounded md:bg-transparent md:p-0 dark:text-white"
//                 href="#"
//               >
//                 <Link to="/frame1">All Jewellery</Link>
//               </a>
//             </li>
//             <li>
//               <a
//                 className="block py-2 pr-4 pl-3  text-xl text-[#2C2C2C] rounded md:bg-transparent md:p-0 dark:text-white"
//                 href="#"
//               >
//                 <Link to="/collections">Collections</Link>
//               </a>
//             </li>
//             <li>
//               <a
//                 className="block py-2 pr-4 pl-3 text-xl text-[#2C2C2C] rounded md:bg-transparent md:p-0 dark:text-white"
//                 href="#"
//               >
//                 <Link to="/contact">Best Sellers</Link>
//               </a>
//             </li>
//             <li>
//               <a
//                 className="block py-2 pr-4 pl-3 text-xl text-[#2C2C2C] rounded md:bg-transparent md:p-0 dark:text-white"
//                 href="#"
//               >
//                 <Link to="/">Sale</Link>
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// function HeartIcon(props) {
//   return (
//     <svg
//       width="28"
//       height="25"
//       viewBox="0 0 28 25"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M13.75 25L12.5924 23.9305C10.099 21.6014 8.03649 19.6077 6.4049 17.9494C4.77331 16.2912 3.48547 14.8287 2.54138 13.5619C1.59729 12.2952 0.937712 11.1492 0.562642 10.1238C0.187548 9.09837 0 8.06697 0 7.02956C0 5.04285 0.660076 3.37458 1.98023 2.02475C3.30038 0.674916 4.93197 0 6.875 0C8.21865 0 9.47907 0.351478 10.6562 1.05443C11.8334 1.75739 12.8647 2.77977 13.75 4.12159C14.6353 2.77977 15.6666 1.75739 16.8438 1.05443C18.0209 0.351478 19.2813 0 20.625 0C22.568 0 24.1996 0.674916 25.5198 2.02475C26.8399 3.37458 27.5 5.04285 27.5 7.02956C27.5 8.06697 27.3125 9.09837 26.9374 10.1238C26.5623 11.1492 25.9027 12.2952 24.9586 13.5619C24.0145 14.8287 22.7316 16.2912 21.1098 17.9494C19.488 19.6077 17.4206 21.6014 14.9076 23.9305L13.75 25ZM13.75 22.8851C16.1944 20.6261 18.206 18.6909 19.7847 17.0797C21.3634 15.4685 22.6111 14.0707 23.5278 12.886C24.4444 11.7014 25.081 10.652 25.4375 9.73774C25.794 8.8235 25.9722 7.92078 25.9722 7.02956C25.9722 5.46743 25.463 4.16566 24.4444 3.12425C23.4259 2.08283 22.1528 1.56212 20.625 1.56212C19.4087 1.56212 18.2863 1.9171 17.258 2.62706C16.2297 3.33702 15.3091 4.40598 14.4963 5.83395H13.0037C12.1713 4.38596 11.2458 3.312 10.2273 2.61207C9.20877 1.91211 8.09134 1.56212 6.875 1.56212C5.3668 1.56212 4.09856 2.08283 3.07026 3.12425C2.04194 4.16566 1.52778 5.46743 1.52778 7.02956C1.52778 7.92078 1.70602 8.8235 2.0625 9.73774C2.41898 10.652 3.05556 11.7014 3.97222 12.886C4.88889 14.0707 6.13657 15.4635 7.71528 17.0647C9.29398 18.6659 11.3056 20.606 13.75 22.8851Z"
//         fill="black"
//       />
//     </svg>
//   );
// }

// function MenuIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <line x1="4" x2="20" y1="12" y2="12" />
//       <line x1="4" x2="20" y1="6" y2="6" />
//       <line x1="4" x2="20" y1="18" y2="18" />
//     </svg>
//   );
// }

// function SearchIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="11" cy="11" r="8" />
//       <path d="m21 21-4.3-4.3" />
//     </svg>
//   );
// }

// function ShoppingBagIcon(props) {
//   return (
//     <svg
//       width="23"
//       height="25"
//       viewBox="0 0 23 25"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M2.27162 25C1.64242 25 1.10651 24.7814 0.663891 24.3443C0.221297 23.9072 0 23.3779 0 22.7564V7.79913C0 7.1777 0.221297 6.6484 0.663891 6.21125C1.10651 5.77412 1.64242 5.55556 2.27162 5.55556H5.625C5.625 4.00819 6.17082 2.69543 7.26247 1.61726C8.35412 0.539087 9.6833 0 11.25 0C12.8167 0 14.1459 0.539087 15.2375 1.61726C16.3292 2.69543 16.875 4.00819 16.875 5.55556H20.2284C20.8576 5.55556 21.3935 5.77412 21.8361 6.21125C22.2787 6.6484 22.5 7.1777 22.5 7.79913V22.7564C22.5 23.3779 22.2787 23.9072 21.8361 24.3443C21.3935 24.7814 20.8576 25 20.2284 25H2.27162ZM2.27162 23.6111H20.2284C20.4447 23.6111 20.643 23.5221 20.8233 23.344C21.0036 23.1659 21.0938 22.9701 21.0938 22.7564V7.79913C21.0938 7.58547 21.0036 7.38961 20.8233 7.21153C20.643 7.03347 20.4447 6.94444 20.2284 6.94444H2.27162C2.05529 6.94444 1.85698 7.03347 1.67667 7.21153C1.49639 7.38961 1.40625 7.58547 1.40625 7.79913V22.7564C1.40625 22.9701 1.49639 23.1659 1.67667 23.344C1.85698 23.5221 2.05529 23.6111 2.27162 23.6111ZM11.25 13.8889C12.8167 13.8889 14.1459 13.3498 15.2375 12.2716C16.3292 11.1935 16.875 9.8807 16.875 8.33333H15.4688C15.4688 9.49074 15.0586 10.4745 14.2383 11.2847C13.418 12.0949 12.4219 12.5 11.25 12.5C10.0781 12.5 9.08203 12.0949 8.26172 11.2847C7.44141 10.4745 7.03125 9.49074 7.03125 8.33333H5.625C5.625 9.8807 6.17082 11.1935 7.26247 12.2716C8.35412 13.3498 9.6833 13.8889 11.25 13.8889ZM7.03125 5.55556H15.4688C15.4688 4.39815 15.0586 3.41435 14.2383 2.60417C13.418 1.79398 12.4219 1.38889 11.25 1.38889C10.0781 1.38889 9.08203 1.79398 8.26172 2.60417C7.44141 3.41435 7.03125 4.39815 7.03125 5.55556Z"
//         fill="black"
//       />
//     </svg>
//   );
// }

// function UserIcon(props) {
//   return (
//     <svg
//       width="28"
//       height="25"
//       viewBox="0 0 28 25"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M13.75 11.3372C12.1295 11.3372 10.7422 10.7822 9.58817 9.67208C8.43415 8.56198 7.85714 7.2275 7.85714 5.66864C7.85714 4.10975 8.43415 2.77525 9.58817 1.66515C10.7422 0.555049 12.1295 0 13.75 0C15.3705 0 16.7578 0.555049 17.9118 1.66515C19.0658 2.77525 19.6429 4.10975 19.6429 5.66864C19.6429 7.2275 19.0658 8.56198 17.9118 9.67208C16.7578 10.7822 15.3705 11.3372 13.75 11.3372ZM0 25V21.8895C0 21.1095 0.236091 20.3797 0.708273 19.7002C1.18045 19.0207 1.8157 18.4932 2.61402 18.1177C4.46749 17.2626 6.32222 16.6212 8.1782 16.1937C10.0342 15.7661 11.8915 15.5523 13.75 15.5523C15.6085 15.5523 17.4658 15.7661 19.3218 16.1937C21.1778 16.6212 23.0325 17.2626 24.886 18.1177C25.6843 18.4932 26.3195 19.0207 26.7917 19.7002C27.2639 20.3797 27.5 21.1095 27.5 21.8895V25H0ZM1.96429 23.1104H25.5357V21.8895C25.5357 21.4704 25.3953 21.0768 25.1145 20.7085C24.8337 20.3403 24.4453 20.0291 23.9492 19.7747C22.3324 19.0213 20.6655 18.4441 18.9483 18.0432C17.2311 17.6423 15.4984 17.4418 13.75 17.4418C12.0016 17.4418 10.2689 17.6423 8.55171 18.0432C6.83454 18.4441 5.16758 19.0213 3.55084 19.7747C3.05473 20.0291 2.66627 20.3403 2.38548 20.7085C2.10468 21.0768 1.96429 21.4704 1.96429 21.8895V23.1104ZM13.75 9.4477C14.8304 9.4477 15.7552 9.07767 16.5246 8.3376C17.2939 7.59754 17.6786 6.70788 17.6786 5.66864C17.6786 4.6294 17.2939 3.73974 16.5246 2.99968C15.7552 2.25961 14.8304 1.88958 13.75 1.88958C12.6696 1.88958 11.7448 2.25961 10.9754 2.99968C10.2061 3.73974 9.82143 4.6294 9.82143 5.66864C9.82143 6.70788 10.2061 7.59754 10.9754 8.3376C11.7448 9.07767 12.6696 9.4477 13.75 9.4477Z"
//         fill="black"
//       />
//     </svg>
//   );
// }

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "time-loom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/userActions";
import ExIphoneLogo from "./ExIphoneLogo";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineUser,
  AiOutlineHistory,
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineWallet,
} from "react-icons/ai";
import { RiDashboardLine } from "react-icons/ri";
import { GiHamburgerMenu, GiMailbox } from "react-icons/gi";
import { BiHistory, BiUser } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { MdTrackChanges } from "react-icons/md";
import { TiTicket } from "react-icons/ti";
import OutsideTouchCloseComponent from "./OutsideTouchCloseComponent";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import logo from "../assets/TrendkartL.jpeg";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { Input } from "./ui/input";

const Navbar = ({ usercheck }) => {
  console.log(usercheck);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProducts, loading, error, totalAvailableProducts } = useSelector(
    (state) => state.userProducts
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [dropDown, setDropDown] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");

  const categories = [
    "Sneakers",
    "Chappals",
    "Perfume",
    "Specs",
    "Watch",
    "Airpod",
    "Airbuds",
    "Headset",
    "Earphones",
    "Gadgets",
  ];

  useEffect(() => {
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
  }, []);

  const toggleDropDown = debounce(() => {
    setDropDown(!dropDown);
  }, 100);

  const handleLogout = () => {
    toggleDropDown();
    dispatch(logout());
    navigate("/");
  };

  const handleClick = (param, value) => {
    // let updatedFilters;
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

  const [showSideNavbar, setShowSideNavbar] = useState(false);
  const toggleSideNavbar = () => {
    // console.log("Hamburger clicked");
    setShowSideNavbar(!showSideNavbar);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="flex-shrink-0">
            {/* <h1 className="text-2xl font-bold text-red-600">Trend Kart</h1> */}
            <img src={logo} alt="logo" className="h-8 w-32" />
          </a>
          <div className="relative hidden flex-1 max-w-xl lg:block">
            <SearchBar
              handleClick={handleClick}
              search={search}
              setSearch={setSearch}

            />
            {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

            <Input
              className="w-full bg-gray-100 pl-10"
              placeholder="Search for Products"
              type="search"
            /> */}
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <Link to="/dashboard/wishlist" variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/dashboard/profile" variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Link>
            {usercheck == true ?
              <Link to="/cart" variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            : <></>}
            

          </div>

        </div>
        {/* Search Bar: Visible below logo and icons in mobile view */}
        <div className="relative w-full lg:hidden mt-4">
          <SearchBar
            handleClick={handleClick}
            search={search}
            setSearch={setSearch}
          />
        </div>
        {/* <nav className="mt-4 hidden lg:block">
          <ul className="flex gap-8">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  href={`/category/${category.toLowerCase()}`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav> */}
      </div>
    </header>
  );
};

export default Navbar;

/*


*/
function HeartIcon(props) {
  return (
    <svg
      width="28"
      height="25"
      viewBox="0 0 28 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 25L12.5924 23.9305C10.099 21.6014 8.03649 19.6077 6.4049 17.9494C4.77331 16.2912 3.48547 14.8287 2.54138 13.5619C1.59729 12.2952 0.937712 11.1492 0.562642 10.1238C0.187548 9.09837 0 8.06697 0 7.02956C0 5.04285 0.660076 3.37458 1.98023 2.02475C3.30038 0.674916 4.93197 0 6.875 0C8.21865 0 9.47907 0.351478 10.6562 1.05443C11.8334 1.75739 12.8647 2.77977 13.75 4.12159C14.6353 2.77977 15.6666 1.75739 16.8438 1.05443C18.0209 0.351478 19.2813 0 20.625 0C22.568 0 24.1996 0.674916 25.5198 2.02475C26.8399 3.37458 27.5 5.04285 27.5 7.02956C27.5 8.06697 27.3125 9.09837 26.9374 10.1238C26.5623 11.1492 25.9027 12.2952 24.9586 13.5619C24.0145 14.8287 22.7316 16.2912 21.1098 17.9494C19.488 19.6077 17.4206 21.6014 14.9076 23.9305L13.75 25ZM13.75 22.8851C16.1944 20.6261 18.206 18.6909 19.7847 17.0797C21.3634 15.4685 22.6111 14.0707 23.5278 12.886C24.4444 11.7014 25.081 10.652 25.4375 9.73774C25.794 8.8235 25.9722 7.92078 25.9722 7.02956C25.9722 5.46743 25.463 4.16566 24.4444 3.12425C23.4259 2.08283 22.1528 1.56212 20.625 1.56212C19.4087 1.56212 18.2863 1.9171 17.258 2.62706C16.2297 3.33702 15.3091 4.40598 14.4963 5.83395H13.0037C12.1713 4.38596 11.2458 3.312 10.2273 2.61207C9.20877 1.91211 8.09134 1.56212 6.875 1.56212C5.3668 1.56212 4.09856 2.08283 3.07026 3.12425C2.04194 4.16566 1.52778 5.46743 1.52778 7.02956C1.52778 7.92078 1.70602 8.8235 2.0625 9.73774C2.41898 10.652 3.05556 11.7014 3.97222 12.886C4.88889 14.0707 6.13657 15.4635 7.71528 17.0647C9.29398 18.6659 11.3056 20.606 13.75 22.8851Z"
        fill="white"
      />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingBagIcon(props) {
  return (
    <svg
      width="23"
      height="25"
      viewBox="0 0 23 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.27162 25C1.64242 25 1.10651 24.7814 0.663891 24.3443C0.221297 23.9072 0 23.3779 0 22.7564V7.79913C0 7.1777 0.221297 6.6484 0.663891 6.21125C1.10651 5.77412 1.64242 5.55556 2.27162 5.55556H5.625C5.625 4.00819 6.17082 2.69543 7.26247 1.61726C8.35412 0.539087 9.6833 0 11.25 0C12.8167 0 14.1459 0.539087 15.2375 1.61726C16.3292 2.69543 16.875 4.00819 16.875 5.55556H20.2284C20.8576 5.55556 21.3935 5.77412 21.8361 6.21125C22.2787 6.6484 22.5 7.1777 22.5 7.79913V22.7564C22.5 23.3779 22.2787 23.9072 21.8361 24.3443C21.3935 24.7814 20.8576 25 20.2284 25H2.27162ZM2.27162 23.6111H20.2284C20.4447 23.6111 20.643 23.5221 20.8233 23.344C21.0036 23.1659 21.0938 22.9701 21.0938 22.7564V7.79913C21.0938 7.58547 21.0036 7.38961 20.8233 7.21153C20.643 7.03347 20.4447 6.94444 20.2284 6.94444H2.27162C2.05529 6.94444 1.85698 7.03347 1.67667 7.21153C1.49639 7.38961 1.40625 7.58547 1.40625 7.79913V22.7564C1.40625 22.9701 1.49639 23.1659 1.67667 23.344C1.85698 23.5221 2.05529 23.6111 2.27162 23.6111ZM11.25 13.8889C12.8167 13.8889 14.1459 13.3498 15.2375 12.2716C16.3292 11.1935 16.875 9.8807 16.875 8.33333H15.4688C15.4688 9.49074 15.0586 10.4745 14.2383 11.2847C13.418 12.0949 12.4219 12.5 11.25 12.5C10.0781 12.5 9.08203 12.0949 8.26172 11.2847C7.44141 10.4745 7.03125 9.49074 7.03125 8.33333H5.625C5.625 9.8807 6.17082 11.1935 7.26247 12.2716C8.35412 13.3498 9.6833 13.8889 11.25 13.8889ZM7.03125 5.55556H15.4688C15.4688 4.39815 15.0586 3.41435 14.2383 2.60417C13.418 1.79398 12.4219 1.38889 11.25 1.38889C10.0781 1.38889 9.08203 1.79398 8.26172 2.60417C7.44141 3.41435 7.03125 4.39815 7.03125 5.55556Z"
        fill="white"
      />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      width="28"
      height="25"
      viewBox="0 0 28 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 11.3372C12.1295 11.3372 10.7422 10.7822 9.58817 9.67208C8.43415 8.56198 7.85714 7.2275 7.85714 5.66864C7.85714 4.10975 8.43415 2.77525 9.58817 1.66515C10.7422 0.555049 12.1295 0 13.75 0C15.3705 0 16.7578 0.555049 17.9118 1.66515C19.0658 2.77525 19.6429 4.10975 19.6429 5.66864C19.6429 7.2275 19.0658 8.56198 17.9118 9.67208C16.7578 10.7822 15.3705 11.3372 13.75 11.3372ZM0 25V21.8895C0 21.1095 0.236091 20.3797 0.708273 19.7002C1.18045 19.0207 1.8157 18.4932 2.61402 18.1177C4.46749 17.2626 6.32222 16.6212 8.1782 16.1937C10.0342 15.7661 11.8915 15.5523 13.75 15.5523C15.6085 15.5523 17.4658 15.7661 19.3218 16.1937C21.1778 16.6212 23.0325 17.2626 24.886 18.1177C25.6843 18.4932 26.3195 19.0207 26.7917 19.7002C27.2639 20.3797 27.5 21.1095 27.5 21.8895V25H0ZM1.96429 23.1104H25.5357V21.8895C25.5357 21.4704 25.3953 21.0768 25.1145 20.7085C24.8337 20.3403 24.4453 20.0291 23.9492 19.7747C22.3324 19.0213 20.6655 18.4441 18.9483 18.0432C17.2311 17.6423 15.4984 17.4418 13.75 17.4418C12.0016 17.4418 10.2689 17.6423 8.55171 18.0432C6.83454 18.4441 5.16758 19.0213 3.55084 19.7747C3.05473 20.0291 2.66627 20.3403 2.38548 20.7085C2.10468 21.0768 1.96429 21.4704 1.96429 21.8895V23.1104ZM13.75 9.4477C14.8304 9.4477 15.7552 9.07767 16.5246 8.3376C17.2939 7.59754 17.6786 6.70788 17.6786 5.66864C17.6786 4.6294 17.2939 3.73974 16.5246 2.99968C15.7552 2.25961 14.8304 1.88958 13.75 1.88958C12.6696 1.88958 11.7448 2.25961 10.9754 2.99968C10.2061 3.73974 9.82143 4.6294 9.82143 5.66864C9.82143 6.70788 10.2061 7.59754 10.9754 8.3376C11.7448 9.07767 12.6696 9.4477 13.75 9.4477Z"
        fill="white"
      />
    </svg>
  );
}
