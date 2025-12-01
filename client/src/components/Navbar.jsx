import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "time-loom";
import { logout } from "../redux/actions/userActions";
import { Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import logo from "../assets/others/bm-logo.png";
import SearchBar from "./SearchBar";

const Navbar = ({ usercheck }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/");
  };

  const onHomeClick = () => {
    navigate("/");
  };
  
  const handleClick = (param, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "" || (param === "page" && value === 1)) {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  };

  // Check if current page is homepage
  const isHomePage = location.pathname === "/";

  // Handle hash navigation when the component mounts or location changes
  useEffect(() => {
    // Only execute on homepage
    if (isHomePage && location.hash) {
      // Remove the # character
      const targetId = location.hash.slice(1);
      
      // Add a small delay to ensure the page has fully loaded
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location, isHomePage]);

  // Handle navigation - direct to new page
  const handleNavigation = (targetId) => {
    setMenuOpen(false); // Close mobile menu
    
    if (isHomePage) {
      // If on home page, use smooth scrolling
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      } else {
        console.error(`Element with id "${targetId}" not found.`);
      }
    } else {
      // If on another page, navigate to home page with hash
      navigate(`/${targetId ? '#' + targetId : ''}`);
    }
  };

  return (
    <header className="sticky top-0 border-b bg-white shadow-md z-50">
      {/* Increased vertical padding for taller navbar */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            {/* Make logo small and crisp: adjust heights for mobile and desktop */}
            <img
              src={logo}
              alt="logo"
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 object-contain"
              style={{ display: "block" }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex gap-8">
            {["Home", "About", "Products", "Testimonials", "Contact"].map((item, index) => {
              const targetId = item.toLowerCase().replace(/\s/g, "");
              return (
                <a
                  key={index}
                  href={`#${targetId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(targetId);
                  }}
                  className="text-gray-700 hover:text-black text-sm font-medium transition-colors cursor-pointer"
                >
                  {item}
                </a>
              );
            })}
          </nav>

          {/* Icons & Search Bar (Right Side) */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar (Next to Wishlist) */}
            <div className="relative hidden max-w-xs lg:block">
              <SearchBar handleClick={handleClick} search={search} setSearch={setSearch} />
            </div>

            {/* Wishlist Icon */}
            <Link to="/dashboard/wishlist">
              <Heart className="h-5 w-5" />
            </Link>

            {/* Profile Icon */}
            <Link to="/dashboard/profile">
              <User className="h-5 w-5" />
            </Link>

            {/* Cart Icon (Only If Logged In) */}
            {usercheck && (
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            )}

            {/* Hamburger Menu for Mobile */}
            <button onClick={toggleMenu} className="lg:hidden">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="relative w-full lg:hidden mt-4">
          <SearchBar handleClick={handleClick} search={search} setSearch={setSearch} />
        </div>
      </div>

      {/* Mobile Navigation Menu (Slide-in effect) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="p-5 flex flex-col gap-6">
          {/* Close Button */}
          <button onClick={toggleMenu} className="self-end">
            <X className="h-6 w-6" />
          </button>

          {/* Mobile Navigation Links */}
          {["Home", "About", "Products", "Testimonials", "Contact"].map((item, index) => {
            const targetId = item.toLowerCase().replace(/\s/g, "");
            return (
              <a
                key={index}
                href={`#${targetId}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(targetId);
                }}
                className="text-gray-700 hover:text-black text-lg font-medium cursor-pointer"
              >
                {item}
              </a>
            );
          })}

          {/* Logout Button (If Logged In) */}
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 text-lg font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;