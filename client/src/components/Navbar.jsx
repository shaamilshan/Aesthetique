import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "time-loom";
import { logout } from "../redux/actions/userActions";
import { getCart } from "../redux/actions/user/cartActions";
import { Heart, User, Menu, X, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion'
import logo from "../assets/others/bm-logo.png";
import SearchBar from "./SearchBar";
import { commonRequest } from "../Common/api";

const Navbar = ({ usercheck }) => {
  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => {
    try {
      // Primary location: state.cart (slice) -> cart (items array)
      if (state.cart && Array.isArray(state.cart.cart)) {
        return state.cart.cart;
      }
      // Fallbacks
      if (state.cart && Array.isArray(state.cart.items)) return state.cart.items;
      if (Array.isArray(state.cart)) return state.cart;
    } catch (err) {
      console.error("Cart selector error:", err);
    }
    return [];
  });
  // Track guest (localStorage) cart count so guests also see the badge
  const [guestCartCount, setGuestCartCount] = React.useState(() => {
    try {
      const raw = localStorage.getItem("guest_cart");
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.length : 0;
    } catch (e) {
      return 0;
    }
  });

  // Prefer server/redux cart for logged in users; fall back to guestCartCount for guests
  const cartCount = user ? (cartItems?.length || 0) : (guestCartCount || cartItems?.length || 0);
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

  // Update guestCartCount when localStorage changes or a custom in-app event fires
  useEffect(() => {
    const updateGuestCount = () => {
      try {
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        setGuestCartCount(Array.isArray(arr) ? arr.length : 0);
      } catch (e) {
        setGuestCartCount(0);
      }
    };

    // storage event fires across tabs; also support a custom event for same-tab updates
    window.addEventListener("storage", updateGuestCount);
    window.addEventListener("guest_cart_updated", updateGuestCount);

    // ensure initial sync
    updateGuestCount();

    return () => {
      window.removeEventListener("storage", updateGuestCount);
      window.removeEventListener("guest_cart_updated", updateGuestCount);
    };
  }, []);

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
          // Normalize marquee items to objects so older arrays of strings continue to work
          const normalized = (res.data.marquee || []).map((it) => typeof it === 'string' ? { content: it } : it || { content: '' });
          setAnnouncement(normalized);
          // Preload any google fonts referenced by announcements
          try {
            const anns = res.data.marquee || [];
            anns.forEach((a) => {
              if (a && a.useGoogleFont && a.googleFontLink) {
                // inject custom google link
                const id = `gf-custom-${btoa(a.googleFontLink).slice(0,8)}`;
                if (!document.getElementById(id)) {
                  const l = document.createElement('link');
                  l.id = id;
                  l.rel = 'stylesheet';
                  l.href = a.googleFontLink;
                  document.head.appendChild(l);
                }
              } else if (a && a.fontFamily) {
                // attempt to detect known google families and load them
                const fams = ['Poppins','Montserrat','Roboto','Lato'];
                const found = fams.find(f => a.fontFamily.includes(f));
                if (found) {
                  const id = `gf-${found}`;
                  if (!document.getElementById(id)) {
                    if (!document.getElementById('gf-preconnect')) {
                      const pre1 = document.createElement('link');
                      pre1.rel = 'preconnect';
                      pre1.href = 'https://fonts.googleapis.com';
                      pre1.id = 'gf-preconnect';
                      document.head.appendChild(pre1);
                      const pre2 = document.createElement('link');
                      pre2.rel = 'preconnect';
                      pre2.href = 'https://fonts.gstatic.com';
                      pre2.crossOrigin = '';
                      document.head.appendChild(pre2);
                    }
                    const link = document.createElement('link');
                    link.id = id;
                    link.rel = 'stylesheet';
                    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(found)}:wght@400;500;600;700&display=swap`;
                    document.head.appendChild(link);
                  }
                }
              }
            });
          } catch (e) {
            // ignore font loading errors
            console.warn('announcement font preload failed', e);
          }
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
        const hasAnnouncement = Array.isArray(announcement) ? announcement.some((x) => !!(x && String(x.content).trim())) : (announcement && String(announcement).trim() !== "");
        // Current announcement object
        const current = Array.isArray(announcement) ? (announcement[announcementIndex] || null) : null;
        const displayText = current ? current.content : (announcement || "");

        // determine readable text color based on bgColor (simple luminance test)
        const getTextColorForBg = (bg) => {
          try {
            if (!bg || typeof bg !== 'string') return '#111827';
            const hex = bg.replace('#','');
            if (hex.length === 3) {
              const r = parseInt(hex[0]+hex[0],16);
              const g = parseInt(hex[1]+hex[1],16);
              const b = parseInt(hex[2]+hex[2],16);
              const lum = 0.2126*r + 0.7152*g + 0.0722*b;
              return lum < 128 ? '#ffffff' : '#111827';
            }
            if (hex.length === 6) {
              const r = parseInt(hex.substring(0,2),16);
              const g = parseInt(hex.substring(2,4),16);
              const b = parseInt(hex.substring(4,6),16);
              const lum = 0.2126*r + 0.7152*g + 0.0722*b;
              return lum < 128 ? '#ffffff' : '#111827';
            }
          } catch (e) {
            // fallback
          }
          return '#111827';
        };

        return hasAnnouncement ? (
          <div className="w-full h-8 overflow-hidden" style={{ backgroundColor: current?.bgColor || 'black' }}>
            <div
              aria-hidden={false}
              role="region"
              aria-label="Announcement"
              className="h-full flex items-center"
            >
              <div key={announcementIndex} className="marquee whitespace-nowrap">
                <span className="text-sm inline-block px-4" style={{ fontFamily: current?.fontFamily, fontSize: current?.fontSize ? `${current.fontSize}px` : undefined, color: getTextColorForBg(current?.bgColor) }}>
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
                  <svg className="h-5 w-5" viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.9892 4.9964H11.9914V3.99712C11.9914 2.93702 11.5702 1.92034 10.8206 1.17073C10.071 0.421124 9.05435 0 7.99425 0C6.93414 0 5.91746 0.421124 5.16785 1.17073C4.41825 1.92034 3.99712 2.93702 3.99712 3.99712V4.9964H0.999281C0.734255 4.9964 0.480084 5.10169 0.292683 5.28909C0.105281 5.47649 0 5.73066 0 5.99568V16.9878C0 17.7828 0.315843 18.5454 0.878048 19.1076C1.44025 19.6698 2.20277 19.9856 2.99784 19.9856H12.9907C13.7857 19.9856 14.5482 19.6698 15.1104 19.1076C15.6727 18.5454 15.9885 17.7828 15.9885 16.9878V5.99568C15.9885 5.73066 15.8832 5.47649 15.6958 5.28909C15.5084 5.10169 15.2542 4.9964 14.9892 4.9964ZM5.99568 3.99712C5.99568 3.46707 6.20625 2.95873 6.58105 2.58393C6.95585 2.20912 7.46419 1.99856 7.99425 1.99856C8.5243 1.99856 9.03264 2.20912 9.40744 2.58393C9.78225 2.95873 9.99281 3.46707 9.99281 3.99712V4.9964H5.99568V3.99712ZM13.9899 16.9878C13.9899 17.2528 13.8847 17.507 13.6972 17.6944C13.5098 17.8818 13.2557 17.9871 12.9907 17.9871H2.99784C2.73282 17.9871 2.47865 17.8818 2.29124 17.6944C2.10384 17.507 1.99856 17.2528 1.99856 16.9878V6.99497H3.99712V7.99425C3.99712 8.25927 4.1024 8.51344 4.28981 8.70084C4.47721 8.88825 4.73138 8.99353 4.9964 8.99353C5.26143 8.99353 5.5156 8.88825 5.703 8.70084C5.8904 8.51344 5.99568 8.25927 5.99568 7.99425V6.99497H9.99281V7.99425C9.99281 8.25927 10.0981 8.51344 10.2855 8.70084C10.4729 8.88825 10.7271 8.99353 10.9921 8.99353C11.2571 8.99353 11.5113 8.88825 11.6987 8.70084C11.8861 8.51344 11.9914 8.25927 11.9914 7.99425V6.99497H13.9899V16.9878Z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full min-w-[13px] h-[13px] px-0.5 ring-2 ring-white z-10">
                      {cartCount}
                    </span>
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
                <Link to="/cart" aria-label="Cart" className="relative flex items-center justify-center text-white/90 hover:text-white transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.9892 4.9964H11.9914V3.99712C11.9914 2.93702 11.5702 1.92034 10.8206 1.17073C10.071 0.421124 9.05435 0 7.99425 0C6.93414 0 5.91746 0.421124 5.16785 1.17073C4.41825 1.92034 3.99712 2.93702 3.99712 3.99712V4.9964H0.999281C0.734255 4.9964 0.480084 5.10169 0.292683 5.28909C0.105281 5.47649 0 5.73066 0 5.99568V16.9878C0 17.7828 0.315843 18.5454 0.878048 19.1076C1.44025 19.6698 2.20277 19.9856 2.99784 19.9856H12.9907C13.7857 19.9856 14.5482 19.6698 15.1104 19.1076C15.6727 18.5454 15.9885 17.7828 15.9885 16.9878V5.99568C15.9885 5.73066 15.8832 5.47649 15.6958 5.28909C15.5084 5.10169 15.2542 4.9964 14.9892 4.9964ZM5.99568 3.99712C5.99568 3.46707 6.20625 2.95873 6.58105 2.58393C6.95585 2.20912 7.46419 1.99856 7.99425 1.99856C8.5243 1.99856 9.03264 2.20912 9.40744 2.58393C9.78225 2.95873 9.99281 3.46707 9.99281 3.99712V4.9964H5.99568V3.99712ZM13.9899 16.9878C13.9899 17.2528 13.8847 17.507 13.6972 17.6944C13.5098 17.8818 13.2557 17.9871 12.9907 17.9871H2.99784C2.73282 17.9871 2.47865 17.8818 2.29124 17.6944C2.10384 17.507 1.99856 17.2528 1.99856 16.9878V6.99497H3.99712V7.99425C3.99712 8.25927 4.1024 8.51344 4.28981 8.70084C4.47721 8.88825 4.73138 8.99353 4.9964 8.99353C5.26143 8.99353 5.5156 8.88825 5.703 8.70084C5.8904 8.51344 5.99568 8.25927 5.99568 7.99425V6.99497H9.99281V7.99425C9.99281 8.25927 10.0981 8.51344 10.2855 8.70084C10.4729 8.88825 10.7271 8.99353 10.9921 8.99353C11.2571 8.99353 11.5113 8.88825 11.6987 8.70084C11.8861 8.51344 11.9914 8.25927 11.9914 7.99425V6.99497H13.9899V16.9878Z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full min-w-[13px] h-[13px] px-0.5 ring-2 ring-black z-10">
                      {cartCount}
                    </span>
                  )}
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
                <svg className="h-5 w-5" viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.9892 4.9964H11.9914V3.99712C11.9914 2.93702 11.5702 1.92034 10.8206 1.17073C10.071 0.421124 9.05435 0 7.99425 0C6.93414 0 5.91746 0.421124 5.16785 1.17073C4.41825 1.92034 3.99712 2.93702 3.99712 3.99712V4.9964H0.999281C0.734255 4.9964 0.480084 5.10169 0.292683 5.28909C0.105281 5.47649 0 5.73066 0 5.99568V16.9878C0 17.7828 0.315843 18.5454 0.878048 19.1076C1.44025 19.6698 2.20277 19.9856 2.99784 19.9856H12.9907C13.7857 19.9856 14.5482 19.6698 15.1104 19.1076C15.6727 18.5454 15.9885 17.7828 15.9885 16.9878V5.99568C15.9885 5.73066 15.8832 5.47649 15.6958 5.28909C15.5084 5.10169 15.2542 4.9964 14.9892 4.9964ZM5.99568 3.99712C5.99568 3.46707 6.20625 2.95873 6.58105 2.58393C6.95585 2.20912 7.46419 1.99856 7.99425 1.99856C8.5243 1.99856 9.03264 2.20912 9.40744 2.58393C9.78225 2.95873 9.99281 3.46707 9.99281 3.99712V4.9964H5.99568V3.99712ZM13.9899 16.9878C13.9899 17.2528 13.8847 17.507 13.6972 17.6944C13.5098 17.8818 13.2557 17.9871 12.9907 17.9871H2.99784C2.73282 17.9871 2.47865 17.8818 2.29124 17.6944C2.10384 17.507 1.99856 17.2528 1.99856 16.9878V6.99497H3.99712V7.99425C3.99712 8.25927 4.1024 8.51344 4.28981 8.70084C4.47721 8.88825 4.73138 8.99353 4.9964 8.99353C5.26143 8.99353 5.5156 8.88825 5.703 8.70084C5.8904 8.51344 5.99568 8.25927 5.99568 7.99425V6.99497H9.99281V7.99425C9.99281 8.25927 10.0981 8.51344 10.2855 8.70084C10.4729 8.88825 10.7271 8.99353 10.9921 8.99353C11.2571 8.99353 11.5113 8.88825 11.6987 8.70084C11.8861 8.51344 11.9914 8.25927 11.9914 7.99425V6.99497H13.9899V16.9878Z" />
                </svg> Cart ({cartCount})
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