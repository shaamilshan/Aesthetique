import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { URL } from "../../Common/api";
import { config } from "../../Common/configurations";
import { Sparkles } from "lucide-react";
import {
  getCart,
  deleteEntireCart,
  deleteOneProduct,
  applyCoupon,
} from "../../redux/actions/user/cartActions";
import { calculateTotalPrice } from "../../redux/reducers/user/cartSlice";
import ConfirmModel from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import CartProductRow from "./components/CartProductRow";
import TotalAndSubTotal from "./components/TotalAndSubTotal";
import JustLoading from "../../components/JustLoading";
import EmptyCart from "../../assets/emptyCart.png";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error, cartId, couponCode, appliedCoupons } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);
  // Defensive fallback: ensure components never read `.length` of null
  const safeCart = cart || [];

  const [inputCouponCode, setInputCouponCode] = useState("");
  const [firstOrderCoupon, setFirstOrderCoupon] = useState(null);

  // Fetching entire cart on page load
  useEffect(() => {
    dispatch(getCart());
  }, []);

  // Fetching first order coupon if eligible
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

  // Calculating the total with the data and updating it when ever there is a change
  useEffect(() => {
    dispatch(calculateTotalPrice());
  }, [cart]);

  // Applying coupon to cart

  const dispatchApplyCoupon = () => {
    if (inputCouponCode.trim() !== "") {
      // console.log();
      dispatch(applyCoupon(inputCouponCode.trim()));
    }
  };

  // Deleting entire cart
  const deleteCart = () => {
    toggleConfirm();
    dispatch(deleteEntireCart(cartId));
  };

  // Modal for deleting entire cart
  const [showConfirm, setShowConfirm] = useState(false);
  const toggleConfirm = () => {
    if (safeCart.length > 0) {
      setShowConfirm(!showConfirm);
    } else {
      toast.error("Nothing in the cart");
    }
  };

  // Deleting one product
  const [productId, setProductId] = useState("");
  const dispatchDeleteProduct = () => {
    dispatch(deleteOneProduct({ cartId, productId }));
    toggleProductConfirm("");
  };

  // Modal for deleting one product from cart
  const [showProductConfirm, setShowProductConfirm] = useState(false);
  const toggleProductConfirm = (id) => {
    setProductId(id);
    setShowProductConfirm(!showProductConfirm);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModel
          title="Clear Shopping Cart?"
          description="Are you sure you want to remove all items from your cart? This action cannot be undone."
          type="warning"
          positiveAction={deleteCart}
          negativeAction={toggleConfirm}
        />
      )}
      {showProductConfirm && (
        <ConfirmModel
          title="Remove Product?"
          description="This item will be removed from your cart. You can add it back later if needed."
          type="warning"
          positiveAction={dispatchDeleteProduct}
          negativeAction={() => toggleProductConfirm("")}
        />
      )}
  {safeCart.length > 0 ? (
        <>
          <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Shopping Bag</h1>
                  <button
                    onClick={toggleConfirm}
                    className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"
                  >
                    <AiOutlineDelete className="text-lg" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                </div>
                <p className="text-gray-500 mt-1">{safeCart.length} {safeCart.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Cart Items */}
                <div className="flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <JustLoading size={10} />
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {safeCart.map((item, index) => (
                        <CartProductRow
                          item={item}
                          toggleProductConfirm={toggleProductConfirm}
                          key={index}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Summary - Sticky */}
                <div className="lg:w-[380px] lg:sticky lg:top-8 lg:self-start">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
                    <TotalAndSubTotal />
                    
                    {/* Coupon Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm font-medium mb-3">Have a promo code?</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:border-black focus:outline-none transition-colors"
                          placeholder="Enter code"
                          value={inputCouponCode}
                          onChange={(e) => setInputCouponCode(e.target.value.toUpperCase())}
                          disabled={loading}
                        />
                        <button
                          className="px-5 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                          onClick={() => {
                            dispatchApplyCoupon();
                            setInputCouponCode("");
                          }}
                          disabled={inputCouponCode.trim() === "" || loading}
                        >
                          Apply
                        </button>
                      </div>
                      {firstOrderCoupon && !(appliedCoupons && appliedCoupons.some(c => c.code.toLowerCase() === firstOrderCoupon.code.toLowerCase())) && (
                        <div className="mt-3 p-3 bg-indigo-50 border border-dashed border-indigo-200 rounded-xl flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="text-indigo-600 flex-shrink-0" size={16} />
                            <p className="text-xs font-semibold text-indigo-900">
                              1st Order Gift: Use <span className="font-mono font-bold text-indigo-700">{firstOrderCoupon.code}</span>
                            </p>
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
                      {appliedCoupons && appliedCoupons.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {appliedCoupons.map((c, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-green-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Voucher "{c.code}" applied (-₹{c.discount})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <button
                      className="w-full mt-6 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors"
                      onClick={() => {
                        if (safeCart.length > 0) {
                          navigate("/checkout");
                        } else {
                          toast.error("No product in cart");
                        }
                      }}
                    >
                      Checkout
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-4">
                      Shipping & taxes calculated at checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              {/* Empty Cart Icon */}
              <div className="mb-8">
                <img
                  src={EmptyCart}
                  alt="Empty Cart Icon"
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Looks like you haven't added anything to your cart yet. 
                  Start shopping to fill it up with amazing products!
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <Link 
                  to="/collections" 
                  className="block w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200"
                >
                  Browse Products
                </Link>
                <Link 
                  to="/" 
                  className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
            
            {/* Quick Links */}
            
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
