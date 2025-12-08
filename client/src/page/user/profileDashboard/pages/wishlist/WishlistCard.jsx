import React, { useState } from "react";
import { Trash2, ShoppingCart, Eye, Star } from "lucide-react";
import axios from "axios";
import { URL } from "../../../../../Common/api";
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

  const addToCart = async (id) => {
    setCartLoading(true);
    try {
      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: 1,
        },
        config
      );
      toast.success("Added to cart");
    } catch (error) {
      const err = error.response.data.error;
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center p-4 gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
          {item.product.imageURL ? (
            <img
              src={`${URL}/img/${item.product.imageURL}`}
              alt={item.product.name}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate(`/product/${item.product._id}`)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xl">📷</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute -top-1 -right-1">
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(item.product.status)}`}>
              {getStatusText(item.product.status)}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3 
            className="font-medium text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-[#A53030] transition-colors"
            onClick={() => navigate(`/product/${item.product._id}`)}
          >
            {item.product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-900">
              ₹{item.product.price?.toLocaleString()}
            </span>
            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{item.product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating (if available) */}
          {item.product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(item.product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({item.product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate(`/product/${item.product._id}`)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="View Product"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => addToCart(item.product._id)}
            disabled={cartLoading || item.product.status === "out of stock"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
              item.product.status === "out of stock"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#A53030] text-white hover:bg-[#8b2626]"
            }`}
          >
            {cartLoading ? (
              <JustLoading size={4} />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {item.product.status === "out of stock" ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>

          <button
            onClick={() => dispatchDeleteFunction(item.product._id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Remove from Wishlist"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;