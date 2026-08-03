import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { URL } from "@/Common/api";
import { getImageUrl } from "@/Common/functions";

// Default fallback promo image asset
import popup1 from "../assets/others/popup1.jpg";

export default function NewsletterModal() {
  const [showModal, setShowModal] = useState(false);
  const [promoData, setPromoData] = useState({
    isActive: true,
    autoSlide: true,
    offers: [
      {
        id: "offer-1",
        headline: "Join Our\nMailing List",
        subtitle: "Stay Informed! Monthly Tips, Tracks and Discount.",
        buttonText: "BUY NOW",
        imageUrl: "",
        productId: ""
      }
    ]
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsMap, setProductsMap] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [fadeText, setFadeText] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const slideTimerRef = useRef(null);

  // Exclude modal from admin and manager views
  const isAdminOrManager = 
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/manager");

  // Fetch promo popup settings
  useEffect(() => {
    if (isAdminOrManager) return;

    let isMounted = true;

    const fetchPromoSettings = async () => {
      try {
        let data = null;
        try {
          const res = await axios.get(`${URL}/public/setting/popup_promo`);
          data = res?.data;
        } catch (e1) {
          try {
            const res2 = await axios.get(`${URL}/setting/popup_promo`);
            data = res2?.data;
          } catch (e2) {
            console.error("Setting fetch error:", e2);
          }
        }

        if (isMounted) {
          let offersList = [];
          if (data && typeof data === "object") {
            if (data.isActive === false) {
              setPromoData(data);
              return;
            }

            if (Array.isArray(data.offers) && data.offers.length > 0) {
              offersList = data.offers;
            } else if (data.headline || data.imageUrl || data.productId) {
              offersList = [{
                id: "offer-1",
                headline: data.headline || "Join Our\nMailing List",
                subtitle: data.subtitle || "Stay Informed! Monthly Tips, Tracks and Discount.",
                buttonText: data.buttonText || "BUY NOW",
                imageUrl: data.imageUrl || "",
                productId: data.productId || ""
              }];
            }
          }

          if (offersList.length === 0) {
            offersList = [
              {
                id: "offer-1",
                headline: "Join Our\nMailing List",
                subtitle: "Stay Informed! Monthly Tips, Tracks and Discount.",
                buttonText: "BUY NOW",
                imageUrl: "",
                productId: ""
              }
            ];
          }

          setPromoData({
            isActive: data?.isActive !== undefined ? data.isActive : true,
            autoSlide: data?.autoSlide !== undefined ? data.autoSlide : true,
            offers: offersList
          });

          // Preload product details for all offers
          const productIds = offersList.map((o) => o.productId).filter(Boolean);
          if (productIds.length > 0) {
            const map = {};
            await Promise.all(
              productIds.map(async (pid) => {
                try {
                  const pRes = await axios.get(`${URL}/user/product/${pid}`);
                  if (pRes?.data?.product) {
                    map[pid] = pRes.data.product;
                  }
                } catch (e) {
                  console.error("Failed to load product", pid, e);
                }
              })
            );
            if (isMounted) {
              setProductsMap(map);
            }
          } else {
            // Fallback product loading
            try {
              const allProdsRes = await axios.get(`${URL}/user/products`);
              const prods = allProdsRes?.data?.products || allProdsRes?.data;
              if (Array.isArray(prods) && prods.length > 0 && isMounted) {
                const fallbackProd = prods[0];
                setProductsMap({ [fallbackProd._id]: fallbackProd });
                setPromoData((prev) => ({
                  ...prev,
                  offers: prev.offers.map((o) => ({ ...o, productId: o.productId || fallbackProd._id }))
                }));
              }
            } catch (err) {
              console.error("Failed to load fallback product:", err);
            }
          }

          const timer = setTimeout(() => {
            if (isMounted) {
              setShowModal(true);
            }
          }, 1000);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error loading promo popup:", error);
        if (isMounted) {
          setShowModal(true);
        }
      }
    };

    fetchPromoSettings();

    return () => {
      isMounted = false;
    };
  }, [isAdminOrManager]);

  // Handle auto-sliding between multiple offers
  useEffect(() => {
    if (!showModal || !promoData.autoSlide || !promoData.offers || promoData.offers.length <= 1) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = setInterval(() => {
      setFadeText(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % promoData.offers.length);
        setFadeText(true);
      }, 250);
    }, 3000);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [showModal, promoData.autoSlide, promoData.offers]);

  const handleDotClick = (index) => {
    if (index === currentSlide) return;
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);

    setFadeText(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFadeText(true);
    }, 250);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const currentOffer = promoData.offers[currentSlide] || promoData.offers[0] || {};
  const currentProduct = productsMap[currentOffer.productId] || Object.values(productsMap)[0] || null;

  const handleBuyNow = async () => {
    const targetProductId = currentOffer.productId || currentProduct?._id;
    
    if (!targetProductId) {
      toast.error("Redirecting to shop...");
      setShowModal(false);
      navigate("/collections");
      return;
    }

    setIsAdding(true);
    const token = localStorage.getItem("token");

    try {
      if (token) {
        // Authenticated user flow
        await axios.post(
          `${URL}/user/cart`,
          { product: targetProductId, quantity: 1, attributes: {} },
          { withCredentials: true }
        );
      } else {
        // Guest user flow
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.findIndex((it) => (it.product?._id || it.product) === targetProductId);

        if (idx >= 0) {
          arr[idx].quantity = (arr[idx].quantity || 0) + 1;
        } else {
          arr.push({
            product: currentProduct || targetProductId,
            quantity: 1,
            attributes: {}
          });
        }
        localStorage.setItem("guest_cart", JSON.stringify(arr));
        try {
          window.dispatchEvent(new Event("guest_cart_updated"));
        } catch (e) {
          console.error(e);
        }
      }

      toast.success("Product added to cart!");
      setShowModal(false);
      navigate("/cart");
    } catch (err) {
      console.error("Buy Now Error:", err);
      toast.error("Product added. Redirecting to cart...");
      setShowModal(false);
      navigate("/cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (!showModal || !promoData || promoData.isActive === false || isAdminOrManager) {
    return null;
  }

  // Determine promo image source for active offer slide
  let promoImageSrc = popup1;
  if (currentOffer.imageUrl) {
    promoImageSrc = getImageUrl(currentOffer.imageUrl, URL);
  } else if (currentProduct && currentProduct.imageURL) {
    promoImageSrc = getImageUrl(currentProduct.imageURL, URL);
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-none sm:rounded-xl overflow-hidden shadow-2xl max-w-[820px] w-full flex flex-col md:flex-row border border-gray-100 transition-all duration-300 scale-95 md:scale-100"
        style={{
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-gray-800 hover:text-black p-1 transition-transform hover:scale-110 focus:outline-none"
          aria-label="Close Promo Modal"
        >
          <HiX className="w-6 h-6" />
        </button>

        {/* Left Column: Image Banner Section (Full Height) */}
        <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[460px] bg-gray-100 relative overflow-hidden flex items-center justify-center">
          <img
            src={promoImageSrc}
            alt={currentOffer.headline || "Special Offer"}
            className={`w-full h-full object-cover transition-opacity duration-300 ${fadeText ? "opacity-100" : "opacity-40"}`}
          />
        </div>

        {/* Right Column: Clean Content Area (No Input Box) */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-white relative">
          
          <div className={`transition-all duration-300 transform flex flex-col items-center justify-center w-full ${fadeText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 font-serif leading-tight mb-4 whitespace-pre-line">
              {currentOffer.headline || "Join Our Mailing List"}
            </h2>

            {/* Subtitle / Description */}
            <p className="text-gray-500 text-xs sm:text-sm font-normal leading-relaxed max-w-xs mx-auto mb-6">
              {currentOffer.subtitle || "Stay Informed! Monthly Tips, Tracks and Discount."}
            </p>

            {/* Product Price Hint if available */}
            {currentProduct && (
              <div className="mb-6 text-xs font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2">
                <span className="truncate max-w-[160px]">{currentProduct.name}</span>
                <span className="font-bold text-black">₹{Number(currentProduct.price).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Buy Now Button (Full Width within max-w-xs) */}
          <button
            onClick={handleBuyNow}
            disabled={isAdding}
            className="w-full max-w-xs bg-[#111] hover:bg-black text-white font-bold py-3.5 px-6 rounded-lg text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                PROCESSING...
              </span>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>{currentOffer.buttonText || "BUY NOW"}</span>
              </>
            )}
          </button>

          {/* No Thanks Link */}
          <button
            onClick={handleClose}
            className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-600 hover:text-black uppercase tracking-wider transition-colors"
          >
            <span>NO, THANK YOU</span>
          </button>

          {/* Slide Pagination Dots for Multiple Offers */}
          {promoData.offers && promoData.offers.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {promoData.offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    index === currentSlide ? "w-6 bg-black" : "w-2 bg-gray-200 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
