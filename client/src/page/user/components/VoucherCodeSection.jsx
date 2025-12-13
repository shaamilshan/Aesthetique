import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon } from "../../../redux/actions/user/cartActions";
import { Ticket, X, Check } from "lucide-react";

const VoucherCodeSection = () => {
  const dispatch = useDispatch();
  const { couponCode, discount, couponType, loading } = useSelector(
    (state) => state.cart
  );
  
  const [inputCouponCode, setInputCouponCode] = useState("");

  useEffect(() => {
    setInputCouponCode(couponCode);
  }, [couponCode]);

  const handleApplyCoupon = () => {
    if (inputCouponCode.trim() !== "") {
      dispatch(applyCoupon(inputCouponCode.trim()));
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setInputCouponCode("");
  };

  const handleInputChange = (e) => {
    setInputCouponCode(e.target.value.toUpperCase());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
  <div className="space-y-4">
      {/* Applied Coupon Display */}
      {couponCode && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Voucher Applied Successfully</p>
                <p className="text-sm text-green-600">
                  Code: <span className="font-mono font-medium">{couponCode}</span>
                  {discount && (
                    <span className="ml-2">
                      • {couponType === "percentage" ? `${discount}% OFF` : `₹${discount} OFF`}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="flex items-center justify-center w-8 h-8 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Remove voucher"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Coupon Input Section */}
      {!couponCode && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Ticket size={20} />
            <span className="text-sm font-medium">Have a voucher code? Enter it below</span>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                className="w-full py-3 px-4 border border-gray-200 rounded-md focus:border-black focus:outline-none text-sm font-mono uppercase placeholder:font-sans placeholder:normal-case bg-white"
                placeholder="Enter voucher code (e.g., SAVE20)"
                value={inputCouponCode}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={inputCouponCode.trim() === "" || loading}
              className="px-5 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Applying..." : "Apply"}
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            Enter your voucher code to get instant discount on your order
          </p>
        </div>
      )}

      {/* Change Coupon Option */}
      {couponCode && (
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              handleRemoveCoupon();
            }}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Use a different voucher code
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherCodeSection;