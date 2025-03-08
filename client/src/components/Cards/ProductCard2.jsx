import { URL } from "@/Common/api";
import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ProductCard2 = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // Get user state from Redux
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const originalPrice = product.offer
    ? Math.round(product.price / (1 - product.offer / 100))
    : product.price;

  const addToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${URL}/user/cart`,
        { product: product._id, quantity: 1 },
        { withCredentials: true }
      );

      console.log("API Response:", response.data); // Log the API response

      // Check if the response contains a cart object
      if (response.data.cart) {
        toast.success("Product added to cart!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("API Error:", error); // Log the error
      setError(error.message);
      toast.error("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer space-y-3 bg-white p-8 rounded-lg "
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={`${URL}/img/${product?.imageURL}`}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 "
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description ||
            "no To Popular Belief, Lorem Ipsum Is Not Simply Random Text."}
        </p>
        <div className="flex items-center gap-[6px]">
          <span className="text-[11px] sm:text-[12px] lg:text-[18px] font-semibold line-through">
            {product.offer && (
              <>
                {product.offer} {/* ₹{originalPrice.toLocaleString()} */}
              </>
            )}
          </span>
          {product.offer && (
            <span className="text-[11px] sm:text-[12px] lg:text-[18px] text-gray-500">From</span>
          )}
          <span className="text-[11px] sm:text-[12px] lg:text-[18px] font-semibold text-red-500">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-3">
          <div className="outline outline-1 p-3 rounded-lg">
            <FaRegHeart className="text-[22px] text-[#A53030]" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card's onClick from firing
              addToCart();
            }}
            disabled={loading}
            className="bg-[#A53030] text-white text-sm px-12 py-2 rounded-md w-3/4 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard2;