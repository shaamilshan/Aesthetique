import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "time-loom";
import { logout } from "../redux/actions/userActions";
import { getCart } from "../redux/actions/user/cartActions";
import { Heart, ShoppingCart, User, Menu, X, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion'
import logo from "../assets/others/bm-logo.png";
import SearchBar from "./SearchBar";
import { commonRequest } from "../Common/api";

const Navbar = ({ usercheck }) => {
  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => {
    try {
      // Correct slice: cart.items are stored under state.cart.cart
      if (Array.isArray(state.cart?.cart)) return state.cart.cart;
      // Fallbacks for any legacy shapes
      if (Array.isArray(state.cart?.items)) return state.cart.items;
      if (Array.isArray(state.userCart?.cart?.items)) return state.userCart.cart.items;
      if (Array.isArray(state.cart)) return state.cart;
    } catch (_) { }
    return [];
  });
  const cartCount = cartItems?.length || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchContainerRef = React.useRef(null);
  const [announcement, setAnnouncement] = useState(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await dispatch(logout()).unwrap();
    } finally {
      navigate("/login", { replace: true });
    }
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

  // Shadow on scroll for visual feedback
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ensure cart is loaded so badge reflects item count even before visiting cart page
  useEffect(() => {
    if (usercheck) {
      dispatch(getCart());
    }
  }, [usercheck, dispatch]);

  // Close expanded search when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (
        searchExpanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [searchExpanded]);

  // Load announcement (marquee) from public announcements API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await commonRequest("get", "/public/announcements");
        if (!mounted) return;
        // Debug: log the response so we can see what the public API returns
        console.debug('public/announcements response', res);
        if (res && res.success && res.data && res.data.marquee) {
          // Extract content from marquee announcements
          const marqueeContents = res.data.marquee.map(ann => ann.content);
          setAnnouncement(marqueeContents);
        }
      } catch (err) {
        // ignore - keep fallback text
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Rotate announcement items (one at a time) when announcement is an array
  useEffect(() => {
    if (!Array.isArray(announcement) || announcement.length <= 1) return;
    setAnnouncementIndex(0);
    const interval = setInterval(() => {
      setAnnouncementIndex((i) => (i + 1) % announcement.length);
    }, 30000); // 30 seconds to match the marquee animation duration
    return () => clearInterval(interval);
  }, [announcement]);

  return (
    <>
      {/* Marquee banner above navbar (reduced height, vertically centered) - hidden when no announcement text */}
      {(() => {
        const hasAnnouncement = Array.isArray(announcement) ? announcement.some((x) => !!String(x).trim()) : (announcement && String(announcement).trim() !== "");
        // Display one announcement at a time
        const displayText = Array.isArray(announcement) ? (announcement[announcementIndex] || "") : (announcement || "");
        return hasAnnouncement ? (
          <div className="w-full bg-black text-white h-8 overflow-hidden">
            <div
              aria-hidden={false}
              role="region"
              aria-label="Announcement"
              className="h-full flex items-center"
            >
              <div key={announcementIndex} className="marquee whitespace-nowrap">
                <span className="text-sm inline-block px-4">
                  {displayText}
                </span>
              </div>
            </div>
          </div>
        ) : null;
      })()}
      <header className={`w-full bg-white`}
        role="banner">
        {/* Increased vertical padding for taller navbar */}
        <div className="w-full px-4 md:px-8 lg:px-12 py-2 lg:py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center ml-0 lg:ml-0">
              {/* Make logo small and crisp: adjust heights for mobile and desktop */}
              <img
                src={logo}
                alt="logo"
                className="h-7 w-auto sm:h-9 md:h-10 lg:h-12 object-contain"
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
              {/* Mobile quick icons: wishlist, profile, cart near hamburger (tighter spacing) */}
              <div className="flex items-center gap-0 lg:hidden">
                <button
                  aria-label="Wishlist"
                  onClick={() => { setMenuOpen(false); navigate('/wishlist'); }}
                  className="p-0.5 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  aria-label="Profile"
                  onClick={() => { setMenuOpen(false); navigate('/dashboard/profile'); }}
                  className="p-0.5 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-5 w-5" />
                </button>
                <button
                  aria-label="Cart"
                  onClick={() => { setMenuOpen(false); navigate('/cart'); }}
                  className="relative p-0.5 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{cartCount}</span>
                  )}
                </button>
              </div>
              {/* Desktop search removed in favor of in-pill expanding search */}

              {/* Icon pill group - match height with search pill */}
              <div className={`hidden lg:flex items-center justify-center gap-3 rounded-full bg-black text-white px-4 h-10 ${searchExpanded ? 'ring-1 ring-white/40' : ''}`} ref={searchContainerRef}>
                {/* Search (left-most inside icon pill) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchExpanded((s) => !s);
                  }}
                  aria-label={searchExpanded ? "Close search" : "Open search"}
                  className="flex items-center justify-center text-white/90 hover:text-white transition-colors"
                >
                  {!searchExpanded ? (
                    <SearchIcon className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </button>
                {/* Animated search reveal (desktop only) - appears to the left of icons and pushes them */}
                <AnimatePresence>
                  {searchExpanded && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 320, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="hidden lg:flex items-center mr-3 overflow-hidden py-1"
                      style={{ transformOrigin: 'left center' }}
                    >
                      {/* inner area is transparent so the outer pill's background and ring are the single source of truth */}
                      <div className="w-full h-full flex items-center bg-transparent rounded-full px-2">
                        <SearchBar handleClick={handleClick} search={search} setSearch={setSearch} autoFocus={true} dark={true} showIcon={false} inPill={true} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Wishlist */}
                <Link to="/wishlist" className="flex items-center justify-center text-white/90 hover:text-white transition-colors">
                  <Heart className="h-5 w-5" />
                </Link>
                {/* Profile */}
                <Link to="/dashboard/profile" className="flex items-center justify-center text-white/90 hover:text-white transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                {/* Cart */}
                <Link to="/cart" className="flex items-center justify-center text-white/90 hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </Link>
              </div>

              {/* Hamburger Menu for Mobile */}
              <button onClick={toggleMenu} className="lg:hidden ml-1 mr-1">
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile search moved into hamburger menu; removed standalone mobile search bar */}
        </div>

        {/* Mobile Navigation Menu (Slide-in effect) */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out lg:hidden`}
        >
          <div className="p-5 flex flex-col gap-4">
            {/* Close Button */}
            <button onClick={toggleMenu} className="self-end">
              <X className="h-6 w-6" />
            </button>
            {/* Mobile Search */}
            <div className="mt-1">
              <SearchBar handleClick={handleClick} search={search} setSearch={setSearch} compact={true} placeholder="Search products" />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col pt-2 gap-2">
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
            </nav>

            <div className="border-t border-gray-200 mt-3 pt-3 flex flex-col gap-2">
              <a onClick={() => { setMenuOpen(false); navigate('/wishlist'); }} className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                <Heart className="h-5 w-5" /> Wishlist
              </a>
              <a onClick={() => { setMenuOpen(false); navigate('/dashboard/profile'); }} className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                <User className="h-5 w-5" /> Profile
              </a>
              <a onClick={() => { setMenuOpen(false); navigate('/cart'); }} className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
                <ShoppingCart className="h-5 w-5" /> Cart ({cartCount})
              </a>
            </div>

            {/* Announcement removed from mobile menu per request */}

            {/* Logout Button (If Logged In) */}
            {user && (
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 text-lg font-medium mt-3 text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

    </>
  );
};

export default Navbar;