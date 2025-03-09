import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/userActions";
import { Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import logo from "../assets/others/Logo.svg";
import SearchBar from "./SearchBar";

const Navbar = ({ usercheck }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/");
  };

  const handleNavigation = (item) => {
    const targetId = item.toLowerCase().replace(/\s/g, "");

    // Navigate to the home page first
    navigate("/");

    // Wait for the home page to load, then scroll to the section
    setTimeout(() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth", // Smooth scrolling
        });
      } else {
        console.error(`Element with id "${targetId}" not found.`);
      }
    }, 100); // Adjust the delay if needed
  };

  return (
    <header className="border-b bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="logo" className="h-8 w-32" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex gap-8">
            {["Home", "About", "Products", "Testimonials", "Contact"].map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase().replace(/\s/g, "")}`} // Ensure this matches the section IDs
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  handleNavigation(item); // Handle navigation and scrolling
                }}
                className="text-gray-700 hover:text-black text-sm font-medium transition-colors cursor-pointer"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Icons & Search Bar (Right Side) */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar (Next to Wishlist) */}
            <div className="relative hidden max-w-xs lg:block">
              <SearchBar search={search} setSearch={setSearch} />
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
          <SearchBar search={search} setSearch={setSearch} />
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
          {["Home", "About", "Products", "Testimonials", "Contact"].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(/\s/g, "")}`} // Link to the section ID
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                handleNavigation(item); // Handle navigation and scrolling
                toggleMenu(); // Close the mobile menu after clicking a link
              }}
              className="text-gray-700 hover:text-black text-lg font-medium cursor-pointer"
            >
              {item}
            </a>
          ))}

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