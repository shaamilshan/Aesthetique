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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mx-5 lg:mx-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-sm text-gray-500 mt-1">
                Your saved favorite items ({wishlist?.length || 0} items)
              </p>
            </div>
            {wishlist && wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-black hover:text-white rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
            </div>
          ) : wishlist && wishlist.length > 0 ? (
            <div className="space-y-4">
              {wishlist.map((item, index) => (
                <WishlistCard item={item} key={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Save your favorite items to your wishlist and never lose track of what you love.
              </p>
              <button
                onClick={() => window.history.back()}
                className="bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium"
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
