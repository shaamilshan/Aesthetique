import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { useParams } from "react-router-dom";
import axios from "axios";
import date from "date-and-time";

import { URL } from "../../../../Common/api";
import { getImageUrl } from "@/Common/functions";
import { FiDownload } from "react-icons/fi";
import Modal from "../../../../components/Modal";
import UpdateOrder from "./UpdateOrder";
import toast from "react-hot-toast";
import { BiCalendar, BiHash } from "react-icons/bi";
import { FaRegCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineUser, AiOutlinePhone } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import StatusComponent from "../../../../components/StatusComponent";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState({});

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/admin/order/${id}`, {
        withCredentials: true,
      });

      if (res) {
        setOrderData(res.data.order);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleUpdateModal = (data) => {
    // If closing (empty object), close modal and refetch order
    if (data && Object.keys(data).length === 0) {
      setUpdateModal(false);
      setSelectedOrderToUpdate({});
      fetchOrder();
      return;
    }

    // Prevent editing cancelled/returned orders
    if (data.status === "cancelled") {
      toast.error("Cannot Edit Cancelled Product");
      return;
    }
    if (data.status === "returned") {
      toast.error("Cannot Edit Returned Product");
      return;
    }

    setSelectedOrderToUpdate(data);
    setUpdateModal(true);
  };

  // Downloading invoice
  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.get(`${URL}/admin/order-invoice/${id}`, {
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
        // attempt to read error message returned as JSON
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

  return (
    <div className="p-5 w-full overflow-y-auto text-sm">
      {updateModal && (
        <Modal
          tab={
            <UpdateOrder toggleModal={toggleUpdateModal} data={selectedOrderToUpdate} />
          }
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Order Details</h1>
          <BreadCrumbs list={["Dashboard", "Orders", "Order Details"]} />
        </div>
        <div className="flex items-center gap-3">
          <button
            className="admin-button-fl bg-gray-200 text-black flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          <button
            className="admin-button-fl bg-black text-white flex items-center gap-2"
            onClick={handleGenerateInvoice}
          >
            <FiDownload />
            Download Invoice
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="mt-6">
          <p className="text-red-600">Error loading order: {String(error)}</p>
        </div>
      ) : (
        orderData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left: Items */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Items</h2>
                  <p className="text-xs text-gray-500">
                    Order: {orderData.orderId || orderData._id} •{' '}
                    {date.format(new Date(orderData.createdAt || Date.now()), 'MMM DD, YYYY')}
                  </p>
                </div>
                <div className="text-sm">
                  <StatusComponent status={orderData.status} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                      <th className="p-3">#</th>
                      <th className="p-3 w-1/2">Product</th>
                      <th className="p-3">Attrs</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(orderData.products) && orderData.products.length > 0 ? (
                      orderData.products.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="p-3 align-top">{idx + 1}</td>
                          <td className="p-3 align-top">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                {item.productId?.imageURL ? (
                                  <img
                                    src={getImageUrl(item.productId.imageURL, URL)}
                                    alt={item.productId?.name || 'product'}
                                    className="object-contain w-full h-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-slate-200 rounded-md" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium line-clamp-2">
                                  {item.productId?.name || item.productName || 'Unnamed product'}
                                </div>
                                <div className="text-xs text-gray-500">SKU: {item.productId?._id || '-'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 align-top text-xs text-gray-600">
                            {item.attributes && Object.keys(item.attributes).length > 0 ? (
                              Object.entries(item.attributes).map(([k, v]) => (
                                <div key={k}><span className="font-medium">{k}:</span> {v}</div>
                              ))
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="p-3 align-top">{item.quantity}</td>
                          <td className="p-3 align-top">{item.price}₹</td>
                          <td className="p-3 align-top">{(item.price * item.quantity) || 0}₹</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500">No items found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Summary & Customer */}
            <aside className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold">Order Summary</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sub total</span>
                    <span>{orderData.subTotal || 0}₹</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{orderData.shipping === 0 ? 'Free' : orderData.shipping || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span>{orderData.discount || 0}₹</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{orderData.tax || 0}₹</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                  <div className="font-bold">Total</div>
                  <div className="text-lg font-semibold">{orderData.totalPrice || 0}₹</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold">Customer</h3>
                <div className="mt-3 text-sm text-gray-700">
                  <div className="font-medium">{orderData.address?.firstName} {orderData.address?.lastName}</div>
                  <div className="text-xs text-gray-500">{orderData.address?.email}</div>
                  <div className="text-xs text-gray-500">{orderData.address?.phoneNumber}</div>
                </div>
                <div className="mt-3 text-sm">
                  <div className="font-semibold">Shipping Address</div>
                  <div className="text-gray-600 text-sm">{orderData.address?.address}</div>
                  <div className="text-gray-600 text-sm">{orderData.address?.pinCode}</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold">Delivery</h3>
                <div className="mt-2 text-sm text-gray-700">
                  <div>Expected: {orderData.deliveryDate ? date.format(new Date(orderData.deliveryDate), 'MMM DD, YYYY') : '—'}</div>
                  <div className="mt-2">Payment: <span className="font-medium">{orderData.paymentMode || '—'}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold">Order Notes</h3>
                <div className="mt-2 text-sm text-gray-700">
                  {orderData.notes ? (
                    <p className="whitespace-pre-wrap">{orderData.notes}</p>
                  ) : (
                    <p className="text-gray-500">Not Added</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold">Actions</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button className="px-3 py-2 bg-black text-white rounded" onClick={handleGenerateInvoice}>Download Invoice</button>
                  {/* Placeholder: action buttons such as update status can go here */}
                  <button
                    className="px-3 py-2 border border-gray-200 rounded text-sm"
                    onClick={() =>
                      toggleUpdateModal({
                        id: orderData._id,
                        status: orderData.status,
                        paymentMode: orderData.paymentMode,
                        deliveryDate: orderData.deliveryDate,
                        trackingId: orderData.trackingId,
                      })
                    }
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )
      )}
    </div>
  );
};

export default OrderDetails;
