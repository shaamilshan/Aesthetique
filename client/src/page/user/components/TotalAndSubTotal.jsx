import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeCoupon } from "../../../redux/actions/user/cartActions";

const TotalAndSubTotal = () => {
  const dispatch = useDispatch();

  // const { totalPrice, shipping, discount, tax, couponType, couponCode } =
  //   useSelector((state) => state.cart);
  const { totalPrice, shipping, discount, couponType, couponCode, cart } =
    useSelector((state) => state.cart);

  // Set tax to 0
  const tax = 0;

  let offer = 0;

  if (couponType === "percentage") {
    offer = (totalPrice * discount) / 100;
  } else {
    offer = discount;
  }

  const finalTotal = totalPrice + shipping + parseInt(tax) - offer;

  // Compute original/strike total to show savings (use originalPrice or markup)
  const originalTotal = (cart || []).reduce((sum, item) => {
    const prod = item.product || {};
    const price = Number(prod.price) || 0;
    const strike = prod.originalPrice ?? prod.markup ?? null;
    const strikeNum = strike ? Number(strike) : null;
    const applicable = strikeNum && strikeNum > price ? strikeNum : price;
    const qty = Number(item.quantity) || 1;
    return sum + applicable * qty;
  }, 0);

  const amountSaved = Math.max(0, originalTotal - Number(totalPrice || 0));

  return (
    <>
      <div className="space-y-3 text-sm text-gray-700">
        {originalTotal > Number(totalPrice || 0) && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Original total</span>
            <span className="text-sm text-gray-500 line-through">₹{Number(originalTotal).toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">₹{Number(totalPrice).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </span>
        </div>
        {parseInt(tax) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span className="font-medium">₹{parseInt(tax)}</span>
          </div>
        )}
        {offer > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Discount</span>
            <span className="text-green-600 font-medium">
              -{couponType === "percentage" ? `${discount}% (₹${offer})` : `₹${offer}`}
            </span>
          </div>
        )}

        {amountSaved > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">You saved</span>
            <span className="text-green-600 font-medium">₹{Number(amountSaved).toLocaleString()}</span>
          </div>
        )}

        {couponCode !== "" && (
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-2.5 mt-2">
            <span className="text-sm text-green-700 font-medium">{couponCode}</span>
            <button
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
              onClick={() => dispatch(removeCoupon())}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
        <span className="font-semibold text-gray-700">Total</span>
        <span className="text-2xl font-extrabold text-gray-900">₹{finalTotal}</span>
      </div>
    </>
  );
};

export default TotalAndSubTotal;
