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
      className="cursor-pointer space-y-3 bg-white p-8 rounded-lg"
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={`${URL}/img/${product?.imageURL}`}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description ||
            "No To Popular Belief, Lorem Ipsum Is Not Simply Random Text."}
        </p>
        <div className="flex items-center gap-[6px]">
          <span className="text-[11px] sm:text-[12px] lg:text-[18px] font-semibold text-red-500">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-3">
          {/* Wishlist Button */}
          <button
            onClick={(e) => { 
              e.stopPropagation();
              handleWishlistClick();
            }}
            disabled={wishlistLoading}
            className={`p-3 rounded-lg border border-[#A53030] transition-all duration-300
              ${isInWishlist ? "bg-red-100" : "hover:bg-red-50"}
              ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isInWishlist ? (
              <FaHeart className="text-[22px] text-[#A53030] scale-110 transition-transform duration-200" />
            ) : (
              <FaRegHeart className="text-[22px] text-[#A53030] hover:scale-110 transition-transform duration-200" />
            )}
          </button>
          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart();
            }}
            disabled={cartLoading}
            className="bg-[#A53030] text-white text-sm px-3 py-2 rounded-md w-3/4 disabled:opacity-50"
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ProductCard2;