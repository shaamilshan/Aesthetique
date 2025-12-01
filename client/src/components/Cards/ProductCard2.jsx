import { URL } from "@/Common/api";
import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
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

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist && wishlist.length > 0) {
      const found = wishlist.some(item => 
        item.product._id === product._id || 
        (item.product && item.product === product._id)
      );
      setIsInWishlist(found);
    } else {
      setIsInWishlist(false);
    }
  }, [wishlist, product._id]);

  // Initial fetch of wishlist when component mounts if user is logged in
  useEffect(() => {
    if (user && user._id && wishlist.length === 0) {
      dispatch(getWishlist());
    }
  }, [user, dispatch, wishlist.length]);

  const originalPrice = product.offer
    ? Math.round(product.price / (1 - product.offer / 100))
    : product.price;

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error("Please log in to use the wishlist.");
      navigate("/login");
      return;
    }

    setWishlistLoading(true);
    setError(null);

    try {
      if (isInWishlist) {
        await dispatch(deleteOneProductFromWishlist(product._id)).unwrap();
        setIsInWishlist(false);
      } else {
        await dispatch(addToWishlist({ product: product._id })).unwrap();
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist Error:", error);
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    setCartLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${URL}/user/cart`,
        { product: product._id, quantity: 1 },
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
      data-aos="fade-left"
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* Image area */}
      <div className="relative bg-white w-full">
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={`${URL}/img/${product?.imageURL}`}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Badge (top-left or top-right) */}
        {product.isNew && (
          <div className="absolute top-3 right-3">
            <span className="inline-block bg-[#FF7B73] text-white text-xs font-semibold px-3 py-1 rounded-full">new</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Ratings row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {/* 5 empty/red star placeholders — you can replace with icons */}
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF7B73]">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FFF" stroke="#FF7B73" strokeWidth="0.5" />
              </svg>
            ))}
          </div>

          <div className="text-xs text-gray-400">150 reviews</div>
        </div>

        <h3 className="text-lg font-medium text-[#2c2540] mb-2">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-[#A53030]">₹{product.price.toLocaleString()}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistClick();
              }}
              disabled={wishlistLoading}
              className={`p-2 rounded-md border border-[#E6E6E6] transition-all duration-200 ${isInWishlist ? "bg-red-50" : "hover:bg-gray-50"} ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isInWishlist ? (
                <FaHeart className="text-[#A53030]" />
              ) : (
                <FaRegHeart className="text-[#A53030]" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart();
              }}
              disabled={cartLoading}
              className="bg-[#2c2540] text-white text-sm px-3 py-2 rounded-md disabled:opacity-50"
            >
              {cartLoading ? "Adding" : "Add"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ProductCard2;