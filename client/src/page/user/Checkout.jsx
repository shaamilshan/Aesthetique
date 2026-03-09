import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { BsArrowRight } from "react-icons/bs";

import axios from "axios";
import { URL } from "../../Common/api";
import logo from "../../assets/others/bm-logo.png";
import { config } from "../../Common/configurations";
import CheckoutCartRow from "./components/CheckoutCartRow";
import AddressCheckoutSession from "./components/AddressCheckoutSession";
import TotalAndSubTotal from "./components/TotalAndSubTotal";
import Loading from "../../components/Loading";
import { clearCartOnOrderPlaced, setShipping, calculateTotalPrice } from "../../redux/reducers/user/cartSlice";
import CheckoutPaymentOption from "./components/CheckoutPaymentOption";
import VoucherCodeSection from "./components/VoucherCodeSection";
import { getShippingCharge } from "../../Common/shippingCharges";
import { getCart } from "../../redux/actions/user/cartActions";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  // Cart from Redux
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { totalPrice, shipping, discount, tax, couponType } = useSelector(
    (state) => state.cart
  );
  const { addresses } = useSelector((state) => state.address);

  // Fetch cart on mount (in case user navigated directly to checkout)
  useEffect(() => {
    dispatch(getCart());
  }, []);

  // Recalculate total price whenever cart items change
  useEffect(() => {
    dispatch(calculateTotalPrice());
  }, [cart]);

  let offer = 0;

  if (couponType === "percentage") {
    offer = (totalPrice * discount) / 100;
  } else {
    offer = discount;
  }

  const finalTotal = totalPrice + shipping + tax - offer;

  // Address Selection (for logged-in users this is an _id; for guests it is the string "guest")
  const [selectedAddress, setSelectedAddress] = useState("");
  // Guest address object
  const [guestAddress, setGuestAddress] = useState(null);

  // Recalculate shipping charge whenever the selected address changes
  useEffect(() => {
    if (!user && guestAddress) {
      // Guest flow: use the inline address object
      dispatch(setShipping(getShippingCharge(guestAddress.pinCode || null, totalPrice)));
    } else if (selectedAddress && addresses && addresses.length > 0) {
      const addr = addresses.find((a) => a._id === selectedAddress);
      if (addr && addr.pinCode) {
        dispatch(setShipping(getShippingCharge(addr.pinCode, totalPrice)));
      } else {
        dispatch(setShipping(getShippingCharge(null, totalPrice)));
      }
    }
  }, [selectedAddress, addresses, guestAddress, user]);

  // Payment Selection
  const [selectedPayment, setSelectedPayment] = useState(null);
  const handleSelectedPayment = (e) => {
    setSelectedPayment(e.target.value);
  };
  // Additional Note
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Page switching
  const [orderPlacedLoading, setOrderPlacedLoading] = useState(false);

  // Order confirmation state
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState({});

  // ── Helper: build guest order items from localStorage cart ──
  const buildGuestItems = () => {
    return (cart || []).map((item) => ({
      productId: item.product?._id || item.product,
      quantity: item.quantity,
      attributes: item.attributes || {},
    }));
  };

  // ── Guest order placement (COD) ──
  const placeGuestOrder = async (paymentMode, razorpayResponse) => {
    setOrderPlacedLoading(true);
    try {
      const items = buildGuestItems();
      const body = {
        items,
        address: guestAddress,
        paymentMode,
        notes: additionalNotes,
        guestEmail: guestAddress?.email || "",
        guestPhone: guestAddress?.phoneNumber || "",
      };

      const orderResponse = await axios.post(`${URL}/public/guest-order`, body, config);
      const { order } = orderResponse.data;

      // If Razorpay, verify payment
      if (paymentMode === "razorPay" && razorpayResponse) {
        await axios.post(
          `${URL}/public/guest-razor-verify`,
          { ...razorpayResponse, order: order._id },
          config
        );
      }

      const formattedOrderData = {
        orderId: order.orderId || order._id,
        _id: order._id,
        totalPrice: order.totalPrice.toFixed(2),
        deliveryDate: order.deliveryDate,
      };

      toast.success("Order Placed Successfully!");
      dispatch(clearCartOnOrderPlaced());
      localStorage.removeItem("guest_cart");
      try { window.dispatchEvent(new Event("guest_cart_updated")); } catch (e) { }

      setOrderData(formattedOrderData);
      setOrderConfirmed(true);
      setOrderPlacedLoading(false);
    } catch (error) {
      console.error("Guest order error:", error);
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
      setOrderPlacedLoading(false);
    }
  };

  // ── Logged-in: Cash on Delivery order ──
  const saveOrderOnCashOnDelivery = async () => {
    setOrderPlacedLoading(true);

    try {
      const orderResponse = await axios.post(
        `${URL}/user/order`,
        {
          notes: additionalNotes,
          address: selectedAddress,
          paymentMode: "cashOnDelivery",
        },
        config
      );

      const { order } = orderResponse.data;

      const formattedOrderData = {
        orderId: order.orderId || order._id,
        _id: order._id,
        totalPrice: order.totalPrice.toFixed(2),
        deliveryDate: order.deliveryDate,
      };

      toast.success("Order Placed Successfully!");
      dispatch(clearCartOnOrderPlaced());

      setOrderData(formattedOrderData);
      setOrderConfirmed(true);
      setOrderPlacedLoading(false);
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
      setOrderPlacedLoading(false);
    }
  };

  // ── Logged-in: Razor Pay — save order after payment ──
  const saveOrder = async (response) => {
    setOrderPlacedLoading(true);

    try {
      const orderResponse = await axios.post(
        `${URL}/user/order`,
        {
          notes: additionalNotes,
          address: selectedAddress,
          paymentMode: selectedPayment,
        },
        config
      );

      const { order } = orderResponse.data;

      await axios.post(
        `${URL}/user/razor-verify`,
        { ...response, order: order._id },
        config
      );

      const formattedOrderData = {
        orderId: order.orderId || order._id,
        _id: order._id,
        totalPrice: order.totalPrice.toFixed(2),
        deliveryDate: order.deliveryDate,
      };

      toast.success("Order Placed");
      dispatch(clearCartOnOrderPlaced());

      setOrderData(formattedOrderData);
      setOrderConfirmed(true);
      setOrderPlacedLoading(false);
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
      setOrderPlacedLoading(false);
    }
  };

  // ── Initiate Razorpay payment ──
  const initiateRazorPayPayment = async () => {
    try {
      // Use public endpoints for guests, user endpoints for logged-in
      const keyUrl = user ? `${URL}/user/razor-key` : `${URL}/public/razor-key`;
      const orderUrl = user ? `${URL}/user/razor-order` : `${URL}/public/razor-order`;

      const {
        data: { key },
      } = await axios.get(keyUrl, config);

      const {
        data: { order },
      } = await axios.post(orderUrl, { amount: parseInt(finalTotal * 100) }, config);

      const prefillName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : guestAddress
          ? `${guestAddress.firstName || ""} ${guestAddress.lastName || ""}`.trim()
          : "";
      const prefillEmail = user?.email || guestAddress?.email || "";
      const prefillContact = user?.phoneNumber || guestAddress?.phoneNumber || "";

      let options = {
        key: key,
        amount: parseInt(finalTotal * 100),
        currency: "INR",
        name: "BM AESTHETIQUE",
        description: "Order Payment",
        order_id: order.id,
        handler: function (response) {
          if (user) {
            saveOrder(response);
          } else {
            placeGuestOrder("razorPay", response);
          }
        },
        prefill: {
          name: prefillName,
          email: prefillEmail,
          contact: prefillContact,
        },
        notes: {
          address: "BM Aesthetique",
        },
        theme: {
          color: "#2b2b30",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      razor.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setOrderPlacedLoading(false);
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setOrderPlacedLoading(false);
    }
  };

  // ── Place order button handler ──
  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Add product to cart");
      return;
    }

    // Address validation
    if (!user && !guestAddress) {
      toast.error("Please add a delivery address");
      return;
    }
    if (user && !selectedAddress) {
      toast.error("Delivery address not found");
      return;
    }

    if (!selectedPayment) {
      toast.error("Please select a payment mode");
      return;
    }

    if (selectedPayment === "razorPay") {
      initiateRazorPayPayment();
      return;
    }

    if (selectedPayment === "cashOnDelivery") {
      toast.error("Cash on Delivery is currently unavailable.");
      return;
    }

    toast.error("Invalid payment method selected.");
  };

  if (orderConfirmed && orderData) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded text-center">
          <div className="mb-6">
            <div className="flex justify-center text-9xl text-green-600 animate-pulse">
              <TiTick />
            </div>
            <h2 className="text-3xl font-semibold text-green-600 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-gray-700">
              Thank you for your order. Your order has been successfully placed.
            </p>
          </div>
          <div className="mb-8">
            <div className="py-3 border-b">
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <p>Order ID: {orderData.orderId}</p>
              <p>Order Total: ₹{orderData.totalPrice}</p>
              {user && (
                <p>
                  <Link
                    to={`/dashboard/order-history/detail/${orderData._id}`}
                    className="flex items-center justify-center gap-2 text-sm py-2 text-blue-500 hover:underline"
                  >
                    View Details <BsArrowRight />
                  </Link>
                </p>
              )}
            </div>
          </div>
          <Link to="/" className="text-blue-500 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {orderPlacedLoading ? (
        <Loading />
      ) : (
        <div className="pt-20 px-4 lg:px-8 pb-16 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto lg:flex lg:items-stretch lg:gap-8">
            <main className="lg:flex-1 lg:flex lg:flex-col">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
                <p className="text-sm text-gray-500 mt-1">Review your items, choose delivery address and payment method.</p>
              </div>

              <div className="lg:flex lg:flex-col lg:h-full lg:gap-6">
                <div className="bg-white shadow-sm rounded-lg p-6 mb-6 lg:mb-0 lg:flex-1">
                  <AddressCheckoutSession
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    guestAddress={guestAddress}
                    setGuestAddress={setGuestAddress}
                  />
                </div>

                <div className="bg-white shadow-sm rounded-lg p-6 mb-6 lg:mb-0 lg:flex-1">
                  <h2 className="text-lg font-semibold mb-3">Payment Options</h2>
                  <CheckoutPaymentOption
                    handleSelectedPayment={handleSelectedPayment}
                    selectedPayment={selectedPayment}
                  />
                </div>
              </div>
            </main>

            {/* Order Summary Session */}
            <aside className="w-full lg:w-96 mt-6 lg:mt-0">
              <div className="bg-white shadow sticky top-28 rounded-lg p-6 border border-gray-100">
                {/* Voucher section — only for logged-in users (server needs auth for coupons) */}
                {user && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Have a voucher?</h4>
                    <div className="bg-white">
                      <VoucherCodeSection />
                    </div>
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
                <div className="divide-y divide-gray-100 space-y-3 mb-3">
                  <div className="pt-1 pb-3">
                    {cart && cart.map((item, index) => (
                      <CheckoutCartRow item={item} key={index} />
                    ))}
                  </div>
                </div>

                <TotalAndSubTotal />

                <button
                  className="mt-6 w-full bg-black text-white uppercase font-semibold text-sm py-3 rounded-md hover:bg-gray-900 transition-colors"
                  onClick={placeOrder}
                >
                  Place order
                </button>
              </div>
            </aside>
          </div>

          {/* Full width Additional Notes */}
          <div className="max-w-6xl mx-auto mt-6">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery instructions (optional)</h3>
              <textarea
                aria-label="Delivery instructions"
                placeholder="Delivery instructions (optional) — e.g. gate code, preferred drop-off spot"
                className="w-full h-40 px-4 py-3 outline-none rounded-lg resize-none border border-gray-100 bg-gray-50"
                value={additionalNotes}
                onChange={(e) => {
                  setAdditionalNotes(e.target.value);
                }}
              ></textarea>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Checkout;