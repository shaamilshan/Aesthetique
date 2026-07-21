import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon } from "../../../redux/actions/user/cartActions";
import { Ticket, X, Check, Sparkles, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { HiX, HiLockClosed } from "react-icons/hi";
import axios from "axios";
import { URL } from "../../../Common/api";
import { config } from "../../../Common/configurations";

const VoucherCodeSection = () => {
  const dispatch = useDispatch();
  const { cart, couponCode, discount, couponType, appliedCoupons, loading } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);
  
  const [inputCouponCode, setInputCouponCode] = useState("");
  const [firstOrderCoupon, setFirstOrderCoupon] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchFirstOrderCoupon = async () => {
      try {
        const { data } = await axios.get(`${URL}/user/first-order-coupon`, config);
        if (data && data.coupon) {
          setFirstOrderCoupon(data.coupon);
        }
      } catch (err) {
        console.error("Error fetching first order coupon:", err);
      }
    };
    if (user) {
      fetchFirstOrderCoupon();
    }
  }, [user]);

  const handleApplyCoupon = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    if (inputCouponCode.trim() !== "") {
      dispatch(applyCoupon(inputCouponCode.trim()));
      setInputCouponCode("");
    }
  };

  const handleRemoveCoupon = (code) => {
    dispatch(removeCoupon(code));
  };

  const handleInputChange = (e) => {
    setInputCouponCode(e.target.value.toUpperCase());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  const firstOrderAlreadyApplied = firstOrderCoupon && appliedCoupons && appliedCoupons.some(c => c.code.toLowerCase() === firstOrderCoupon.code.toLowerCase());

  return (
    <>
      <div className="space-y-4">
        {/* Applied Coupon Display */}
        {appliedCoupons && appliedCoupons.length > 0 && (
          <div className="space-y-3">
            <p className="font-semibold text-sm text-gray-700">Applied Vouchers:</p>
            {appliedCoupons.map((c, i) => {
              const matchingItems = (cart || []).filter(
                (item) =>
                  item.appliedCouponCode &&
                  item.product &&
                  item.appliedCouponCode.toLowerCase() === c.code.toLowerCase() &&
                  item.discount > 0
              );

              return (
                <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mt-0.5 flex-shrink-0">
                        <Check size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-green-800">
                          Code: <span className="font-mono font-bold">{c.code}</span>
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Saved ₹{c.discount} on eligible products
                        </p>
                        {matchingItems.length > 0 && (
                          <ul className="mt-2 pl-4 list-disc space-y-1 border-t border-green-100 pt-1.5">
                            {matchingItems.map((item, idx) => {
                              const originalLineTotal = item.product.price * item.quantity;
                              const discountedLineTotal = originalLineTotal - item.discount;
                              return (
                                <li key={idx} className="text-xs text-green-700">
                                  <span className="font-medium">{item.product.name}</span> (x{item.quantity}): Saved <span className="font-bold">₹{item.discount}</span>
                                  <span className="text-gray-500 font-normal ml-1">
                                    (₹{discountedLineTotal.toLocaleString()} after discount)
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCoupon(c.code)}
                      className="flex items-center justify-center w-8 h-8 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                      title="Remove voucher"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Coupon Input Section */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Ticket size={20} />
            <span className="text-sm font-medium">Apply another voucher code</span>
          </div>
          
          {/* Guest login hint */}
          {!user && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <LogIn size={14} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Login required</span> — Vouchers can only be applied by logged-in users.
              </p>
            </div>
          )}

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
            Vouchers individually apply discount to eligible items in your cart
          </p>

          {firstOrderCoupon && !firstOrderAlreadyApplied && (
            <div className="mt-3 p-3 bg-indigo-50 border border-dashed border-indigo-200 rounded-xl flex items-center justify-between gap-2 text-sm font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="text-indigo-600 flex-shrink-0" size={16} />
                <span className="font-semibold text-indigo-900 text-xs">
                  1st Order Gift: Use <span className="font-mono font-bold text-indigo-700">{firstOrderCoupon.code}</span>
                </span>
              </div>
              <button
                onClick={() => {
                  dispatch(applyCoupon(firstOrderCoupon.code));
                }}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg shadow-sm transition-all"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Required Popup for Guests */}
      {showLoginPopup && (
        <div 
          onClick={() => setShowLoginPopup(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative border border-gray-100 transform scale-100 transition-all duration-300"
          >
            <button 
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <HiX className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="bg-amber-50 text-amber-600 rounded-full p-3.5 shadow-inner">
                <Ticket className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login to Apply Voucher</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Please log in or create an account to apply voucher codes and unlock exclusive discounts.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/login?redirect=/checkout" 
                className="w-full py-2.5 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-full shadow hover:shadow-md transition-all duration-200 text-sm text-center"
              >
                Log In
              </Link>
              <Link 
                to="/register?redirect=/checkout" 
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-300 rounded-full hover:border-gray-400 transition-all duration-200 text-sm text-center"
              >
                Create Account
              </Link>
              <button 
                onClick={() => setShowLoginPopup(false)}
                className="w-full text-xs text-gray-400 hover:text-gray-500 transition-colors mt-1 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoucherCodeSection;