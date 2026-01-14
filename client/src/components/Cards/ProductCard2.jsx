import { URL } from "@/Common/api";
import { getImageUrl } from "@/Common/functions";
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  deleteOneProductFromWishlist,
  getWishlist
} from "@/redux/actions/user/wishlistActions";

const ProductCard2 = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && wishlist.length > 0 && product?._id) {
      const found = wishlist.some(item => {
        if (!item || !item.product) return false;
        return item.product._id === product._id || item.product === product._id;
      });
      setIsInWishlist(found);
    } else {
      setIsInWishlist(false);
    }
  }, [wishlist, product?._id]);

  // Initial fetch of wishlist when component mounts if user is logged in
  useEffect(() => {
    // Fetch wishlist if not loaded yet (supports guest wishlist via localStorage)
    if (wishlist?.length === 0) {
      dispatch(getWishlist());
    }
  }, [user, dispatch, wishlist?.length]);

  // Early return if no product (after hooks)
  if (!product) {
    return null;
  }

  const hasStrike = Boolean(product.markup) && Number(product.markup) > 0 && Number(product.markup) > Number(product.price);
  const strikePrice = hasStrike ? Number(product.markup) : null;
  const discountPercent = hasStrike
    ? Math.max(
        0,
        Math.round(
          ((Number(product.markup) - Number(product.price)) /
            Number(product.markup)) * 100
        )
      )
    : 0;

  const handleWishlistClick = async () => {
    // Support guest wishlist via localStorage; wishlistActions already handles guest case.

    setWishlistLoading(true);
    setError(null);

    try {
      if (isInWishlist) {
        await dispatch(deleteOneProductFromWishlist(product._id)).unwrap();
        // Fetch updated wishlist from Redux store
        dispatch(getWishlist());
      } else {
        // pass full product object so guest flow can store useful info in localStorage
        await dispatch(addToWishlist({ product })).unwrap();
        // Fetch updated wishlist from Redux store
        dispatch(getWishlist());
      }
    } catch (error) {
      console.error("Wishlist Error:", error);
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    setCartLoading(true);
    setError(null);

    if (!token) {
      // Guest flow: keep a guest_cart in localStorage with items: [{ product, quantity, attributes }]
      try {
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.findIndex((it) => (it.product?._id || it.product) === product._id);
        if (idx >= 0) {
          arr[idx].quantity = (arr[idx].quantity || 0) + 1;
        } else {
          arr.push({ product, quantity: 1, attributes: {} });
        }
  localStorage.setItem("guest_cart", JSON.stringify(arr));
  try { window.dispatchEvent(new Event('guest_cart_updated')); } catch (e) {}
  toast.success("Product added to cart!");
      } catch (error) {
        console.error("Guest cart error:", error);
        toast.error("Failed to add product to cart.");
      } finally {
        setCartLoading(false);
      }

      return;
    }

    try {
      const response = await axios.post(
        `${URL}/user/cart`,
        { product: product._id, quantity: 1, attributes: {} },
        { withCredentials: true }
      );

      if (response.data.cart) {
        toast.success("Product added to cart!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
      toast.error("Failed to add product to cart.");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Image area */}
      <div className="relative bg-gray-50 w-full">
        <div className="aspect-[3/4] w-full bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-3xl relative">
          {/* Primary Image */}
          <img
            src={getImageUrl(product?.imageURL, URL)}
            alt={product.name}
            className={`h-full w-full object-cover transition-opacity duration-500 ${isHovered && product?.moreImageURL?.length > 0 ? 'opacity-0' : 'opacity-100'}`}
          />
          {/* Secondary Image (shown on hover) */}
          {product?.moreImageURL?.length > 0 && (
            <img
              src={getImageUrl(product.moreImageURL[0], URL)}
              alt={`${product.name} - alternate view`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>

        {/* Wishlist & Cart buttons - top right */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistClick();
            }}
            disabled={wishlistLoading}
            className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-white ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${isInWishlist ? "fill-black text-black" : "text-gray-600 hover:text-gray-800"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
            }}
            disabled={cartLoading}
            className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-white ${cartLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <svg className="h-5 w-5 text-gray-600 hover:text-gray-800" viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9892 4.9964H11.9914V3.99712C11.9914 2.93702 11.5702 1.92034 10.8206 1.17073C10.071 0.421124 9.05435 0 7.99425 0C6.93414 0 5.91746 0.421124 5.16785 1.17073C4.41825 1.92034 3.99712 2.93702 3.99712 3.99712V4.9964H0.999281C0.734255 4.9964 0.480084 5.10169 0.292683 5.28909C0.105281 5.47649 0 5.73066 0 5.99568V16.9878C0 17.7828 0.315843 18.5454 0.878048 19.1076C1.44025 19.6698 2.20277 19.9856 2.99784 19.9856H12.9907C13.7857 19.9856 14.5482 19.6698 15.1104 19.1076C15.6727 18.5454 15.9885 17.7828 15.9885 16.9878V5.99568C15.9885 5.73066 15.8832 5.47649 15.6958 5.28909C15.5084 5.10169 15.2542 4.9964 14.9892 4.9964ZM5.99568 3.99712C5.99568 3.46707 6.20625 2.95873 6.58105 2.58393C6.95585 2.20912 7.46419 1.99856 7.99425 1.99856C8.5243 1.99856 9.03264 2.20912 9.40744 2.58393C9.78225 2.95873 9.99281 3.46707 9.99281 3.99712V4.9964H5.99568V3.99712ZM13.9899 16.9878C13.9899 17.2528 13.8847 17.507 13.6972 17.6944C13.5098 17.8818 13.2557 17.9871 12.9907 17.9871H2.99784C2.73282 17.9871 2.47865 17.8818 2.29124 17.6944C2.10384 17.507 1.99856 17.2528 1.99856 16.9878V6.99497H3.99712V7.99425C3.99712 8.25927 4.1024 8.51344 4.28981 8.70084C4.47721 8.88825 4.73138 8.99353 4.9964 8.99353C5.26143 8.99353 5.5156 8.88825 5.703 8.70084C5.8904 8.51344 5.99568 8.25927 5.99568 7.99425V6.99497H9.99281V7.99425C9.99281 8.25927 10.0981 8.51344 10.2855 8.70084C10.4729 8.88825 10.7271 8.99353 10.9921 8.99353C11.2571 8.99353 11.5113 8.88825 11.6987 8.70084C11.8861 8.51344 11.9914 8.25927 11.9914 7.99425V6.99497H13.9899V16.9878Z" />
            </svg>
          </button>
        </div>

        {/* Badge (top-left) */}
        {product.isNew && (
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">Best Seller</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 h-7">{product.name}</h3>
        
        {/* Description area with fixed height */}
        <div className="mb-4 h-10">
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {product.description || "Premium skincare product."}
          </p>
        </div>

        {/* Price always at bottom */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString()}
            {hasStrike && (
              <span className="text-gray-400 line-through text-xs ml-3">
                ₹{strikePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default ProductCard2;