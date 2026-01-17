import React, { useState } from "react";
import { Trash2, ShoppingCart, Eye, Star } from "lucide-react";
import axios from "axios";
import { URL } from "../../../../../Common/api";
import { getImageUrl } from "../../../../../Common/functions";
import toast from "react-hot-toast";
import { config } from "../../../../../Common/configurations";
import { useNavigate } from "react-router-dom";
import { deleteOneProductFromWishlist } from "../../../../../redux/actions/user/wishlistActions";
import { useDispatch } from "react-redux";
import JustLoading from "../../../../../components/JustLoading";

const WishlistCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);

  const addToCart = async (id, redirectToCheckout = false) => {
    setCartLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest flow - add to guest_cart in localStorage
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.findIndex((it) => (it.product?._id || it.product) === id);
        if (idx >= 0) {
          arr[idx].quantity = (arr[idx].quantity || 0) + 1;
        } else {
          // We only have the id here; store minimal object
          arr.push({ product: { _id: id }, quantity: 1, attributes: {} });
        }
  localStorage.setItem("guest_cart", JSON.stringify(arr));
  try { window.dispatchEvent(new Event('guest_cart_updated')); } catch (e) {}
  toast.success("Added to cart");
        if (redirectToCheckout) navigate("/checkout");
        return;
      }

      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: 1,
          attributes: {},
        },
        config
      );
      toast.success("Added to cart");
      if (redirectToCheckout) {
        navigate("/checkout");
      }
    } catch (error) {
      const err = error.response?.data?.error || "Something went wrong";
      toast.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  // Function for deleting one product from the wishlist
  const dispatchDeleteFunction = (productId) => {
    dispatch(deleteOneProductFromWishlist(productId));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "low quantity":
        return "bg-yellow-100 text-yellow-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "published":
        return "In Stock";
      case "draft":
        return "Not Available";
      case "unpublished":
        return "Not Available";
      case "low quantity":
        return "Low Stock";
      case "out of stock":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

  // If product is missing (deleted), show a placeholder card
  if (!item.product) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4 flex items-center gap-3 opacity-60">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl">📦</div>
        <div className="flex-1">
          <div className="font-semibold text-gray-500">Product unavailable</div>
          <div className="text-xs text-gray-400 mt-1">This product has been removed from the store.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/product/${item.product._id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex items-center p-3 gap-3">
        {/* Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
          {item.product.imageURL ? (
            <img
              src={getImageUrl(item.product.imageURL, URL)}
              alt={item.product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">📷</span>
            </div>
          )}
          {/* Status badge intentionally hidden in wishlist view */}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3 
            className="font-medium text-gray-900 text-sm mb-1 line-clamp-1"
          >
            {item.product.name}
          </h3>

          {(() => {
            const priceNum = Number(item.product.price);
            const safePrice = Number.isFinite(priceNum) ? priceNum : null;
            const strikeRaw = item.product.originalPrice ?? item.product.markup ?? null;
            const strikeNum = strikeRaw === "" || strikeRaw === null || strikeRaw === undefined ? null : Number(strikeRaw);
            const hasStrike = strikeNum !== null && !Number.isNaN(strikeNum) && strikeNum > 0 && safePrice !== null && strikeNum > safePrice;

            return (
              <div className="text-sm font-semibold text-gray-900 mb-2">
                {safePrice !== null ? `₹${safePrice.toLocaleString()}` : "—"}
                {hasStrike ? (
                  <span className="text-xs text-gray-500 line-through ml-2">₹{strikeNum.toLocaleString()}</span>
                ) : null}
              </div>
            );
          })()}

          {/* Price */}
          <div className="flex w-full sm:w-auto sm:flex-row flex-col items-stretch sm:items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item.product._id, false);
              }}
              disabled={cartLoading || item.product.status === "out of stock"}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm sm:text-xs transition-colors duration-200 ${
                item.product.status === "out of stock"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {cartLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border border-gray-300 border-t-white"></div>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="ml-1">{item.product.status === "out of stock" ? "Out of Stock" : "Add to cart"}</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item.product._id, true);
              }}
              disabled={cartLoading || item.product.status === "out of stock"}
              className={`w-full sm:w-auto flex items-center justify-center px-3 py-2 rounded-lg font-medium text-sm sm:text-xs transition-colors duration-200 border ${
                item.product.status === "out of stock"
                  ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  : "border-black text-black bg-white hover:bg-gray-50"
              }`}
            >
              Buy now
            </button>
          </div>
          {/* Delete button placed at the right end of the card */}
        </div>
        <div className="flex-shrink-0 ml-auto pr-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatchDeleteFunction(item.product._id);
            }}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove from Wishlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;