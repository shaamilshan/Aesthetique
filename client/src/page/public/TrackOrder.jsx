import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../Common/api";
import { config } from "../../Common/configurations";
import Loading from "../../components/Loading";
import { TiTick } from "react-icons/ti";
import { BsBoxSeam, BsTruck, BsCheck2Circle, BsXCircle } from "react-icons/bs";

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const fetchOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${URL}/public/order/${orderId}`, config);
      setOrder(response.data.order);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Order not found");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    } else {
      setOrder(null);
      setError(null);
      setLoading(false);
    }
  }, [id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/track-order/${searchInput.trim()}`);
  };

  if (loading) return <Loading />;

  // Initial Search State (when no ID is in URL)
  if (!id && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-black text-5xl mb-6 flex justify-center">
            <BsBoxSeam />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Track Your Order</h2>
          <p className="text-gray-500 text-center mb-8">Enter your order number to see its current status and delivery details.</p>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Order Number</label>
              <input 
                type="text" 
                placeholder="e.g. 1013"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform active:scale-[0.98]">
              Track Now
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
          <div className="text-red-500 text-6xl mb-4 flex justify-center">
            <BsXCircle />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="inline-block bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { status: "pending", icon: <BsBoxSeam />, label: "Order Placed" },
    { status: "processing", icon: <BsCheck2Circle />, label: "Processing" },
    { status: "shipped", icon: <BsTruck />, label: "Dispatched" },
    { status: "delivered", icon: <TiTick />, label: "Delivered" },
  ];

  const currentStatusIndex = order ? steps.findIndex((s) => s.status === order.status) : 0;

  if (!order && !error) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-black p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Order Tracking</p>
                <h1 className="text-3xl font-bold">#{order.orderId || order._id}</h1>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-8 border-b border-gray-100">
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors duration-300 ${
                    index <= currentStatusIndex ? "bg-black text-white" : "bg-white border-2 border-gray-100 text-gray-300"
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`mt-3 text-sm font-medium ${index <= currentStatusIndex ? "text-black" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Items */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                Order Items <span className="bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">{order.products.length}</span>
              </h3>
              <div className="space-y-4">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      {item.productId?.imageURL?.[0] ? (
                        <img src={item.productId.imageURL[0]} alt={item.productId.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><BsBoxSeam /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.productId?.name || "Product"}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">₹{item.totalPrice}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{order.subTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total Amount</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Delivery Address</h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-800 mb-1">{order.address?.firstName} {order.address?.lastName}</p>
                  <p>{order.address?.address}</p>
                  <p>{order.address?.city}, {order.address?.regionState}</p>
                  <p>{order.address?.country} - {order.address?.pinCode}</p>
                  <p className="mt-2 flex items-center gap-2">
                    <span className="text-gray-400 font-medium text-xs">Phone:</span> {order.address?.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-dashed border-gray-100 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-4">If you have any questions about your delivery, feel free to contact us.</p>
                <a href="mailto:help.bmaesthetique@gmail.com" className="text-sm font-bold text-black hover:underline underline-offset-4">
                  help.bmaesthetique@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
           <Link to="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
             &larr; Back to Shop
           </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
