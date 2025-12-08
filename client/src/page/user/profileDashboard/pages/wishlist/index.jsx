import React, { useEffect } from "react";
import {
  getWishlist,
  deleteEntireWishlist,
} from "../../../../../redux/actions/user/wishlistActions";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Heart } from "lucide-react";
import WishlistCard from "./WishlistCard";
import JustLoading from "../../../../../components/JustLoading";

const WishList = () => {
  const dispatch = useDispatch();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, []);

  // Function for clearing the wishlist
  const clearWishlist = () => {
    dispatch(deleteEntireWishlist());
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm mx-5 lg:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#A53030]" />
            <h1 className="text-xl font-semibold text-gray-900">My Wishlist</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {wishlist?.length || 0} items
            </span>
          </div>
          {wishlist && wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <JustLoading size={10} />
            </div>
          ) : wishlist && wishlist.length > 0 ? (
            <div className="space-y-4">
              {wishlist.map((item, index) => (
                <WishlistCard item={item} key={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Heart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Save your favorite items to your wishlist and never lose track of what you love.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-[#A53030] text-white rounded-lg hover:bg-[#8b2626] transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
