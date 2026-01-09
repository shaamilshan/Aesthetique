import React from "react";
import { URL } from "../../../Common/api";
import { getImageUrl } from "../../../Common/functions";
import {
  incrementCount,
  decrementCount,
} from "../../../redux/actions/user/cartActions";
import Quantity from "../components/Quantity";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import JustLoading from "../../../components/JustLoading";

const CartProductRow = ({ item, toggleProductConfirm }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartId, countLoading } = useSelector((state) => state.cart);

  const dispatchIncrement = (item) => {
    dispatch(
      incrementCount({
        cartId,
        productId: item.product._id,
        attributes: item.attributes,
        productdata: item.product,
        quantity: item.quantity,
      })
    );
  };

  const dispatchDecrement = (item) => {
    dispatch(decrementCount({ cartId, productId: item.product._id }));
  };

  return (
    <div className="py-6 first:pt-0 last:pb-0">
      {!item || !item.product ? (
        <div className="bg-white p-4 rounded-lg border border-gray-200 opacity-60">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            <div>
              <div className="font-semibold text-gray-700">Product unavailable</div>
              <div className="text-xs text-gray-500">This product was removed from the store.</div>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex gap-4 sm:gap-6">
        {/* Product Image */}
        <div 
          className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/product/${item.product._id}`)}
        >
          {item.product.imageURL ? (
            <img
              src={getImageUrl(item.product.imageURL, URL)}
              alt={item.product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200"></div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 
              className="font-medium text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => navigate(`/product/${item.product._id}`)}
            >
              {item.product.name}
            </h3>
            
            {/* Attributes */}
            {item.attributes && Object.keys(item.attributes).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <span key={key} className="text-xs sm:text-sm text-gray-500">
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}

            {/* Price - moved to right column for consistent alignment */}
          </div>

          {/* Bottom Row - Quantity (delete moved to right column) */}
          <div className="flex items-center mt-3 sm:mt-0">
            <div className="flex items-center gap-3">
              {countLoading ? (
                <JustLoading size={6} />
              ) : (
                <Quantity
                  count={item.quantity}
                  increment={() => dispatchIncrement(item)}
                  decrement={() => dispatchDecrement(item)}
                  minimal={true}
                />
              )}
            </div>
          </div>
        </div>
        {/* Right column: Price, Total and Delete - always visible to align actions to row end */}
        <div className="flex flex-col items-end justify-between min-w-[72px]">
          {(() => {
            const priceNum = Number(item.product.price) || 0;
            const strikeRaw = item.product.originalPrice ?? item.product.markup ?? null;
            const strikeNum = strikeRaw === "" || strikeRaw === null || strikeRaw === undefined ? null : Number(strikeRaw);
            const hasStrike = strikeNum !== null && !Number.isNaN(strikeNum) && strikeNum > 0 && strikeNum > priceNum;
            return (
              <div className="text-right">
                <div className="font-medium">
                  ₹{priceNum.toLocaleString()}
                  {hasStrike ? (
                    <span className="text-xs text-gray-500 line-through ml-2">₹{strikeNum.toLocaleString()}</span>
                  ) : null}
                </div>
                <div className="text-sm text-gray-500">
                  Total: <span className="font-medium text-black">₹{Number(priceNum * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            );
          })()}

          <button
            onClick={() => toggleProductConfirm(item.product._id)}
            className="mt-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <AiOutlineDelete className="text-lg sm:text-xl" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CartProductRow;
