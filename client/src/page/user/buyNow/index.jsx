import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "axios";
import { URL } from "@common/api";
import logo from "../../../assets/others/bm-logo.png";
import { config } from "@common/configurations";
import CheckoutCartRow from "../components/CheckoutCartRow";
import AddressCheckoutSession from "../components/AddressCheckoutSession";
import Loading from "../../../components/Loading";
// import OrderConfirmation from "../components/OrderConfirmation";
import { emptyBuyNowStore } from "../../../redux/reducers/user/buyNowSlice";
import CheckoutPaymentOption from "../components/CheckoutPaymentOption";
import { getShippingCharge } from "@common/shippingCharges";

import { Sparkles, X } from "lucide-react";

const BuyNow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, quantity } = useSelector((state) => state.buyNow);
  const { addresses } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.user);

  const [inputCouponCode, setInputCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingLocal, setApplyingLocal] = useState(false);
  const [firstOrderCoupon, setFirstOrderCoupon] = useState(null);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, []);

  let totalPrice = product ? product.price * quantity : 0;
  const [shipping, setShipping] = useState(null);
  let tax = 0;

  let offer = 0;
  let couponType = appliedCoupon ? appliedCoupon.type : "";
  let discount = appliedCoupon ? appliedCoupon.value : 0;
  let couponCodeApplied = appliedCoupon ? appliedCoupon.code : "";

  if (appliedCoupon) {
    if (couponType === "percentage") {
      offer = (totalPrice * discount) / 100;
    } else {
      offer = discount;
    }
  }

  const finalTotal = totalPrice + (shipping || 0) + tax - offer;

  // Wallet balance
  const [walletBalance, setWalletBalance] = useState(0);

  // Address Selection
  const [selectedAddress, setSelectedAddress] = useState("");

  // Recalculate shipping charge based on selected address pin code
  useEffect(() => {
    if (selectedAddress && addresses && addresses.length > 0) {
      const addr = addresses.find((a) => a._id === selectedAddress);
      if (addr && addr.pinCode) {
        setShipping(getShippingCharge(addr.pinCode, totalPrice));
      } else {
        setShipping(getShippingCharge(null, totalPrice));
      }
    }
  }, [selectedAddress, addresses]);

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

  const handleApplyCouponCode = async (code) => {
    if (!code || code.trim() === "") return;
    setApplyingLocal(true);
    try {
      const { data } = await axios.post(
        `${URL}/user/coupon-check`,
        {
          code: code.trim(),
          subTotal: totalPrice,
          isBuyNow: true,
          productId: product?._id,
          quantity: quantity,
        },
        config
      );
      setAppliedCoupon(data.coupon);
      setInputCouponCode(data.coupon.code);
      window.dispatchEvent(new CustomEvent("buy-now-coupon-applied", { detail: data.coupon.code }));
      toast.success("Promo code applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setApplyingLocal(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setInputCouponCode("");
    window.dispatchEvent(new CustomEvent("buy-now-coupon-applied", { detail: "" }));
    toast.success("Promo code removed.");
  };

  // Listen to custom event from the global promo card
  useEffect(() => {
    const handleApplyEvent = (e) => {
      const code = e.detail;
      handleApplyCouponCode(code);
    };
    window.addEventListener("apply-buy-now-coupon", handleApplyEvent);
    return () => {
      window.removeEventListener("apply-buy-now-coupon", handleApplyEvent);
    };
  }, [totalPrice]);

  // Payment Selection
  const [selectedPayment, setSelectedPayment] = useState(null);
  const handleSelectedPayment = (e) => {
    setSelectedPayment(e.target.value);
  };
  // Additional Note
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Page switching
  const [orderPlacedLoading, setOrderPlacedLoading] = useState(false);
  // const [confirmationPage, setConfirmationPage] = useState(false);
  // const [orderData, setOrderData] = useState({});

  const navigateToOrderConfirmation = (orderD) => {
    if (orderD) {
      navigate("/order-confirmation", { state: orderD });
    }
  };

  // Cash on delivery or wallet balance
  const saveOrderOnCashDeliveryOrMyWallet = async (response) => {
    setOrderPlacedLoading(true);

    try {
      const order = await axios.post(
        `${URL}/user/buy-now/${product._id}`,
        {
          notes: additionalNotes,
          address: selectedAddress,
          paymentMode: selectedPayment,
          quantity,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        },
        config
      );

      // Updating user side
      // setOrderData(order.data.order);
      toast.success("Order Placed");
      setOrderPlacedLoading(false);
      // setConfirmationPage(true);
      dispatch(emptyBuyNowStore());
      navigateToOrderConfirmation(order.data.order);
    } catch (error) {
      // Error Handling
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setOrderPlacedLoading(false);
    }
  };

  // Razor Pay payment

  // Saving the order to db
  const saveOrder = async (response) => {
    setOrderPlacedLoading(true);

    try {
      // Make the first POST request to create the order
      const orderResponse = await axios.post(
        `${URL}/user/buy-now/${product._id}`,
        {
          notes: additionalNotes,
          address: selectedAddress,
          paymentMode: selectedPayment,
          quantity: 1,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        },
        config
      );

      const { order } = orderResponse.data;

      // Make the second POST request to verify payment with Razorpay and save that to database
      await axios.post(
        `${URL}/user/razor-verify`,
        { ...response, order: order._id },
        config
      );

      // Updating user side
      // setOrderData(order);
      toast.success("Order Placed");
      setOrderPlacedLoading(false);
      // setConfirmationPage(true);
      dispatch(emptyBuyNowStore());
      navigateToOrderConfirmation(order);
    } catch (error) {
      // Error Handling
      console.log(error);
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setOrderPlacedLoading(false);
    }
  };

  // Initiating razor pay payment method or window
  const initiateRazorPayPayment = async () => {
    // Getting razor-pay secret key
    const {
      data: { key },
    } = await axios.get(`${URL}/user/razor-key`, { withCredentials: true });

    const payload = {
      address: selectedAddress,
      notes: additionalNotes,
      paymentMode: "razorPay",
      isGuest: false,
      isBuyNow: true,
      productId: product?._id,
      quantity: quantity,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
    };

    // making razor-pay order
    const {
      data: { order },
    } = await axios.post(
      `${URL}/user/razor-order`,
      { amount: parseInt(finalTotal), payload },
      config
    );

    // setting razor pay configurations
    let options = {
      key: key,
      amount: parseInt(finalTotal / 100),
      currency: "INR",
      name: "TrendKart",
      description: "Test Transaction",
      // No logo passed to Razorpay (intentionally left blank to avoid PNA/CORS issues)
      order_id: order.id,
      handler: function (response) {
        saveOrder(response);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razor pay Corporate Office",
      },
      theme: {
        color: "#2b2b30",
      },
    };

    // enabling razor-pay payment screen
    const razor = new window.Razorpay(options);

    razor.open();

    // If failed toast it.
    razor.on("payment.failed", function (response) {
      toast.error(response.error.code);
      toast.error(response.error.description);
      toast.error(response.error.source);
      toast.error(response.error.step);
      toast.error(response.error.reason);
      toast.error(response.error.metadata.order_id);
      toast.error(response.error.metadata.payment_id);
      setOrderPlacedLoading(false);
    });
  };

  // Order placing
  const placeOrder = async () => {
    // Validating before placing an order
    if (!selectedAddress) {
      toast.error("Delivery address not found");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment mode");
      return;
    }

    if (selectedPayment === "myWallet") {
      let entireTotal =
        Number(totalPrice) + Number(discount) + Number(tax) - Number(offer);
      if (walletBalance < entireTotal) {
        toast.error("Not balance in your wallet");
        return;
      }
    }

    if (selectedPayment === "razorPay") {
      initiateRazorPayPayment();
      return;
    }

    if (selectedPayment === "myWallet") {
      // Save order using wallet balance
      saveOrderOnCashDeliveryOrMyWallet();
      return;
    }

    if (selectedPayment === "cashOnDelivery") {
      toast.error("Cash on Delivery is currently unavailable.");
      return;
    }

    // If we reach here, payment method is invalid
    toast.error("Invalid payment method selected.");
  };

  return (
    <>
      {orderPlacedLoading ? (
        <Loading />
      ) : (
        <div className="pt-20 px-5 lg:p-20 lg:flex items-start gap-5 bg-gray-100">
          <div className="lg:w-3/4">
            <AddressCheckoutSession
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            <div className="bg-white my-5 p-5 rounded">
              <h1 className="text-xl font-semibold border-b pb-2 mb-3">
                Payment Option
              </h1>
              <CheckoutPaymentOption
                handleSelectedPayment={handleSelectedPayment}
                selectedPayment={selectedPayment}
                walletBalance={walletBalance}
                setWalletBalance={setWalletBalance}
              />
            </div>

            <p className="my-1 font-semibold">Additional Notes</p>
            <textarea
              placeholder="Notes about your order e.g. special notes for delivery"
              className="w-full h-40 px-3 py-2 outline-none rounded resize-none"
              value={additionalNotes}
              onChange={(e) => {
                setAdditionalNotes(e.target.value);
              }}
            ></textarea>
          </div>

          {/* Order Summary Session */}

          <div className="lg:w-1/4 bg-white px-5 py-3 border border-gray-200 rounded shrink-0">
            <h1 className="font-semibold py-2">Order Summary </h1>
            <div className="py-1">
              {product && <CheckoutCartRow item={{ product, quantity }} />}
            </div>
            <>
              <div className="border-b border-gray-200 pb-2 mb-2">
                <div className="cart-total-li">
                  <p className="cart-total-li-first">Sub Total</p>
                  <p className="cart-total-li-second">{totalPrice}₹</p>
                </div>
                <div className="cart-total-li">
                  <p className="cart-total-li-first">Shipping</p>
                  <p className="cart-total-li-second">
                    {selectedAddress ? (
                      shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        `${shipping}₹`
                      )
                    ) : (
                      <span className="text-gray-400 text-xs italic font-normal">Calculating...</span>
                    )}
                  </p>
                </div>
                <div className="cart-total-li">
                  <p className="cart-total-li-first">Tax</p>
                  <p className="cart-total-li-second">{parseInt(tax)}₹</p>
                </div>
                <div className="cart-total-li">
                  <p className="cart-total-li-first">Discount</p>
                  <p className="cart-total-li-second">
                    {offer > 0
                      ? couponType === "percentage"
                        ? `${discount}% Off (${offer}₹)`
                        : `${offer}₹ Off`
                      : "0₹"}
                  </p>
                </div>

                {appliedCoupon && (
                  <div className="cart-total-li bg-indigo-50 border border-dashed border-indigo-200 p-2.5 rounded-xl mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Voucher Applied</p>
                      <p className="font-mono text-xs font-bold text-indigo-700">{appliedCoupon.code}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove Coupon"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Coupon Section Input */}
              {!appliedCoupon && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Have a promo code?</p>
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      className="min-w-0 flex-1 py-2 px-3 rounded-lg border border-gray-200 bg-white text-xs uppercase font-mono focus:border-black focus:outline-none transition-colors"
                      placeholder="Enter code"
                      value={inputCouponCode}
                      onChange={(e) => setInputCouponCode(e.target.value)}
                    />
                    <button
                      className="flex-shrink-0 px-4 py-2 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={() => handleApplyCouponCode(inputCouponCode)}
                      disabled={applyingLocal || inputCouponCode.trim() === ""}
                    >
                      {applyingLocal ? "..." : "Apply"}
                    </button>
                  </div>

                  {/* Inline suggestion block */}
                  {firstOrderCoupon && (
                    <div className="mt-2.5 p-2 bg-indigo-50 border border-dashed border-indigo-200 rounded-lg flex items-center justify-between gap-2 text-xs w-full">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Sparkles className="text-indigo-600 flex-shrink-0" size={13} />
                        <span className="font-semibold text-indigo-950 text-[10px] truncate">
                          1st Order Gift: Use <span className="font-mono font-bold text-indigo-700">{firstOrderCoupon.code}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleApplyCouponCode(firstOrderCoupon.code)}
                        className="flex-shrink-0 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-150 px-2 py-0.5 rounded shadow-sm transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="cart-total-li mt-4 pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-500">Total</p>
                <p className="font-semibold">{finalTotal}₹</p>
              </div>
            </>
            <button
              className="btn-blue w-full text-white uppercase font-semibold text-sm my-5"
              onClick={placeOrder}
            >
              Place order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyNow;
