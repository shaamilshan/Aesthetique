import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";
import { applyCoupon } from "../redux/actions/user/cartActions";
import { Gift, X, Sparkles, Percent, Check } from "lucide-react";
import toast from "react-hot-toast";

const FirstOrderPromo = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { couponCode } = useSelector((state) => state.cart);

  const [coupon, setCoupon] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    sessionStorage.getItem("dismiss_first_order_promo") === "true"
  );
  const [applying, setApplying] = useState(false);
  const [buyNowAppliedCode, setBuyNowAppliedCode] = useState("");

  // Listen to coupon applications on /buy-now to hide the banner reactively
  useEffect(() => {
    const handleApplied = (e) => {
      setBuyNowAppliedCode(e.detail || "");
    };
    window.addEventListener("buy-now-coupon-applied", handleApplied);
    return () => {
      window.removeEventListener("buy-now-coupon-applied", handleApplied);
    };
  }, []);

  useEffect(() => {
    // Only fetch for logged-in regular users
    if (!user || user.role !== "user") {
      setCoupon(null);
      setVisible(false);
      return;
    }

    // Only show on /cart, /checkout, and /buy-now pages
    const isCartOrCheckoutOrBuyNow =
      location.pathname === "/cart" ||
      location.pathname === "/checkout" ||
      location.pathname === "/buy-now";
    if (!isCartOrCheckoutOrBuyNow) {
      setVisible(false);
      return;
    }

    const fetchPromo = async () => {
      try {
        const { data } = await axios.get(`${URL}/user/first-order-coupon`, config);
        if (data && data.coupon) {
          setCoupon(data.coupon);
          
          // Decide matching code based on page type
          const currentAppliedCode =
            location.pathname === "/buy-now" ? buyNowAppliedCode : couponCode;

          // Only show if not dismissed and not already applied
          if (!dismissed && currentAppliedCode !== data.coupon.code) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        } else {
          setCoupon(null);
          setVisible(false);
        }
      } catch (err) {
        console.error("Error fetching first order coupon:", err);
      }
    };

    fetchPromo();
  }, [user, location.pathname, dismissed, couponCode, buyNowAppliedCode]);

  const handleDismiss = () => {
    sessionStorage.setItem("dismiss_first_order_promo", "true");
    setDismissed(true);
    setVisible(false);
  };

  const handleApply = async () => {
    if (!coupon) return;
    setApplying(true);
    try {
      if (location.pathname === "/buy-now") {
        // Dispatch custom event for local buyNow component
        window.dispatchEvent(new CustomEvent("apply-buy-now-coupon", { detail: coupon.code }));
      } else {
        await dispatch(applyCoupon(coupon.code)).unwrap();
        toast.success("Welcome discount applied successfully!");
      }
    } catch (err) {
      // toast is already fired inside redux action on failure
    } finally {
      setApplying(false);
    }
  };

  if (!visible || !coupon) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl border border-gray-150 shadow-2xl overflow-hidden transition-all duration-300 transform translate-y-0 scale-100 hover:shadow-3xl hover:-translate-y-1 animate-in slide-in-from-bottom-10 fade-in">
      {/* Premium top accent color strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      
      <div className="p-6 relative">
        {/* Dismiss / Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Dismiss Offer"
        >
          <X size={16} />
        </button>

        {/* Promo Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <Gift size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
              <Sparkles size={10} /> Limited Welcome Offer
            </span>
            <h3 className="font-extrabold text-gray-900 text-base leading-tight mt-1">
              Your First Order Discount
            </h3>
          </div>
        </div>

        {/* Promo Description */}
        <p className="text-gray-500 text-sm mb-4 leading-relaxed font-sans">
          Unlock a special welcome gift of <span className="font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`} OFF</span> on your order subtotal.
        </p>

        {/* Coupon code wrapper */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Percent size={14} className="text-gray-400" />
            <span className="font-mono font-bold text-gray-800 text-sm select-all tracking-wider">
              {coupon.code}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium font-sans">Copy code</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApply}
          disabled={applying}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-sans"
        >
          {applying ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Check size={16} />
          )}
          {applying ? "Applying..." : "Apply Coupon Automatically"}
        </button>
      </div>
    </div>
  );
};

export default FirstOrderPromo;
