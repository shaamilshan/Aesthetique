import React, { useEffect, useState } from "react";
import { TiCancel } from "react-icons/ti";
import { BsArrowLeft } from "react-icons/bs";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";

import axios from "axios";
import { URL } from "../../../Common/api";
import { config } from "../../../Common/configurations";
import { useNavigate, useParams } from "react-router-dom";
import date from "date-and-time";
import Modal from "../../../components/Modal";
import StatusComponent from "../../../components/StatusComponent";
import OrderDetailsProductRow from "./OrderDetailsProductRow";
import OrderCancellation from "./OrderCancellation";
import OrderHistoryAddress from "./OrderHistoryAddress";
import ProductReview from "./ProductReview";
import StatusHistoryLoadingBar from "./StatusHistoryLoadingBar";
import ReturnProduct from "./ReturnProduct";
import {
  getStatusDate,
  modifyPaymentModeText,
  getImageUrl,
} from "../../../Common/functions";
import OrderDates from "./OrderDates";
import YourReview from "./YourReview";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/user/order/${id}`, config);

      if (res) {
        setOrderData(res.data.order);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  // Function for return date calculation
  const calcReturnDate = (d) => {
    const originalDate = new Date(d);
    const modifiedDate = new Date(originalDate);
    modifiedDate.setDate(originalDate.getDate() + 7);

    const formattedDate = date.format(modifiedDate, "MMM DD, YYYY");
    return formattedDate;
  };

  // Function to check if the return date is before today
  const isReturnDateBeforeToday = (returnDate) => {
    const today = new Date();
    return new Date(returnDate) <= today;
  };

  // Toggle Modals
  const [cancelModal, setCancelModal] = useState(false);
  const toggleCancelModal = () => {
    setCancelModal(!cancelModal);
  };
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const toggleReviewModal = (reviewPro) => {
    setReviewModal(!reviewModal);
    setReviewProduct(reviewPro);
  };
  const [returnModal, setReturnModal] = useState(false);
  const toggleReturnModal = () => {
    setReturnModal(!returnModal);
  };

  // Downloading invoice
  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.get(`${URL}/user/order-invoice/${id}`, {
        responseType: "blob",
        withCredentials: true,
      });
      const contentType = response.headers["content-type"] || "";
      if (contentType.includes("application/pdf")) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "invoice.pdf";
        link.click();
      } else {
        try {
          const text = await response.data.text();
          const json = JSON.parse(text);
          console.error("Invoice generation error:", json);
          alert(json.error || "Unable to generate invoice");
        } catch (e) {
          console.error("Unknown response while generating invoice", e);
          alert("Unable to generate invoice");
        }
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Polling: refresh order details periodically so admin-side updates reflect on user UI
  useEffect(() => {
    let intervalId = null;
    const finalStatuses = ["delivered", "cancelled", "returned"];

    // Start polling only if order exists and it's not in a final status
    if (orderData && orderData.status && !finalStatuses.includes(orderData.status)) {
      intervalId = setInterval(() => {
        loadData();
      }, 10000); // every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData?.status, id]);

  return (
    <>
      {orderData && (
        <div className="min-h-screen bg-gray-50 w-full px-4 lg:px-0 py-6">
          {/* Top bar: simple title + back */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <BsArrowLeft />
                </button>
                <h1 className="text-xl font-semibold">Order #{orderData.orderId || orderData._id}</h1>
              </div>
              <div className="text-sm text-gray-600">{date.format(new Date(orderData.createdAt || Date.now()), 'MMM DD, YYYY')}</div>
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500">Items</div>
                <div className="font-medium">{orderData.totalQuantity} products</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Payment</div>
                <div className="font-medium">{modifyPaymentModeText(orderData.paymentMode)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-bold">{orderData.totalPrice}₹</div>
              </div>
              <div className="flex items-center gap-2">
                {orderData.status === 'shipped' && (
                  <div className="text-sm">
                    <div className="text-gray-500">Tracking</div>
                    {orderData.trackingId ? (
                      <a href={orderData.trackingId} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">{orderData.trackingId}</a>
                    ) : (
                      <div className="text-gray-400 text-sm">No tracking</div>
                    )}
                  </div>
                )}
                <div>
                  <StatusComponent status={orderData.status} />
                </div>
                <button onClick={handleGenerateInvoice} className="px-3 py-2 bg-black text-white rounded text-sm">Invoice</button>
                {/* Show return button when delivered and within 7 days */}
                {(() => {
                  // find delivered date from statusHistory
                  let deliveredAt = null;
                  if (orderData.statusHistory && Array.isArray(orderData.statusHistory)) {
                    for (let i = orderData.statusHistory.length - 1; i >= 0; i--) {
                      const h = orderData.statusHistory[i];
                      if (h.status === 'delivered') {
                        deliveredAt = h.date;
                        break;
                      }
                    }
                  }

                  // fallback to deliveryDate
                  if (!deliveredAt && orderData.deliveryDate) {
                    deliveredAt = orderData.deliveryDate;
                  }

                  if (deliveredAt) {
                    const now = new Date();
                    const msDiff = now - new Date(deliveredAt);
                    const daysElapsed = msDiff / (1000 * 60 * 60 * 24);

                    if (orderData.status === 'delivered' && daysElapsed <= 7) {
                      return (
                        <button onClick={toggleReturnModal} className="px-3 py-2 bg-red-600 text-white rounded text-sm">Request Return</button>
                      );
                    }

                    if (orderData.status === 'delivered' && daysElapsed > 7) {
                      return (
                        <div className="px-3 py-2 text-sm text-gray-500">Return window expired</div>
                      );
                    }
                  }

                  return null;
                })()}
              </div>
            </div>
              {/* Status history */}
            {orderData.statusHistory && (
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <StatusHistoryLoadingBar statusHistory={orderData.statusHistory} />
              </div>
            )}

              {/* Return modal */}
              {returnModal && (
                <Modal onClose={toggleReturnModal}>
                  <ReturnProduct closeToggle={toggleReturnModal} id={id} loadData={loadData} />
                </Modal>
              )}

            {/* Products list */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="font-semibold mb-3">Products</h2>
              <div className="divide-y">
                {orderData.products && orderData.products.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {item.productId?.imageURL ? (
                        <img src={getImageUrl(item.productId.imageURL, URL)} alt={item.productId?.name} className="object-contain w-full h-full" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 rounded-md" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.productId?.name || item.productName}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity} • {item.price}₹</div>
                    </div>
                    <div className="font-semibold">{(item.price * item.quantity) || 0}₹</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & addresses & notes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between"><span>Sub total</span><span>{orderData.subTotal || 0}₹</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{orderData.shipping === 0 ? 'Free' : orderData.shipping || 0}</span></div>
                  <div className="flex justify-between"><span>Discount</span><span>{orderData.discount || 0}₹</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{orderData.tax || 0}₹</span></div>
                  <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>{orderData.totalPrice || 0}₹</span></div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">Shipping Address</h4>
                  <div className="text-sm text-gray-700">{orderData.address?.firstName} {orderData.address?.lastName}</div>
                  <div className="text-sm text-gray-600">{orderData.address?.address}</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">Order Notes</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{orderData.notes || 'Not Added'}</div>
              </div>
            </div>

            <YourReview id={id} products={orderData.products} />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
