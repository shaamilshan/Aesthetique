import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingOrders, deletePendingOrder } from "../../../../redux/actions/admin/ordersAction";
import BreadCrumbs from "../../Components/BreadCrumbs";
import JustLoading from "../../../../components/JustLoading";
import SearchBar from "../../../../components/SearchBar";
import Pagination from "../../../../components/Pagination";
import Modal from "../../../../components/Modal";
import { AiOutlineClose, AiOutlineEye, AiOutlineDelete } from "react-icons/ai";

const PendingOrders = () => {
  const dispatch = useDispatch();
  const { pendingOrders, loading, totalAvailablePendingOrders } = useSelector(
    (state) => state.orders
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  const handleFilter = (type, value) => {
    if (type === "page") {
      setPage(value);
    }
  };

  const removeFilters = () => {
    setSearch("");
    setPage(1);
  };

  useEffect(() => {
    const queries = new URLSearchParams();
    queries.set("page", page);
    queries.set("limit", 10);
    if (search.trim()) {
      queries.set("search", search.trim());
    }
    dispatch(getPendingOrders(queries.toString()));
  }, [page, search, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pending order?")) {
      dispatch(deletePendingOrder(id));
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setDetailModal(true);
  };

  return (
    <>
      {detailModal && selectedOrder && (
        <Modal
          tab={
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">Pending Order Details</h2>
                <button
                  onClick={() => setDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Razorpay Order ID</p>
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.razorpay_order_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Checkout Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.isGuest ? "Guest Checkout" : "Registered User"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Created Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Expires At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.expireAt ? new Date(selectedOrder.expireAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Shipping / Contact Address */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Customer & Shipping Address</h3>
                  {selectedOrder.payload?.address ? (
                    <div className="bg-white border rounded-xl p-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedOrder.payload.address.firstName} {selectedOrder.payload.address.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.payload.address.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.payload.address.city}, {selectedOrder.payload.address.regionState} - {selectedOrder.payload.address.pinCode}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm text-gray-600">
                        <p><strong>Email:</strong> {selectedOrder.payload.address.email || selectedOrder.payload.guestEmail || "N/A"}</p>
                        <p><strong>Phone:</strong> {selectedOrder.payload.address.phoneNumber || selectedOrder.payload.guestPhone || "N/A"}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No address payload available.</p>
                  )}
                </div>

                {/* Items details */}
                {selectedOrder.payload?.items && selectedOrder.payload.items.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Guest Cart Items</h3>
                    <div className="border rounded-xl divide-y overflow-hidden">
                      {selectedOrder.payload.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{item.product?.name || "Product"}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-gray-900">
                            ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedOrder.payload?.notes && (
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Additional Notes</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">
                      {selectedOrder.payload.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          }
        />
      )}

      <div className="p-5 w-full min-h-screen overflow-x-hidden md:overflow-visible text-sm">
        <SearchBar
          handleClick={(type, value) => {
            if (type === "search") {
              setSearch(value);
              setPage(1);
            }
          }}
          search={search}
          setSearch={setSearch}
          placeholder="Search by Order ID, name, email..."
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-semibold gap-3 md:gap-0 mt-5">
          <div>
            <h1 className="font-bold text-2xl">Non-Completed Orders (Razorpay)</h1>
            <BreadCrumbs list={["Dashboard", "Orders", "Non-Completed"]} />
          </div>
          {search && (
            <button
              onClick={removeFilters}
              className="admin-button-fl bg-gray-200 text-black hover:bg-gray-300"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <JustLoading size={10} />
          </div>
        ) : pendingOrders && pendingOrders.length > 0 ? (
          <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg mt-5 border">
            <table className="w-full min-w-max table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="admin-table-head">No:</th>
                  <th className="admin-table-head">Razorpay Order ID</th>
                  <th className="admin-table-head">Customer Name</th>
                  <th className="admin-table-head">Email</th>
                  <th className="admin-table-head">Phone</th>
                  <th className="admin-table-head">Checkout Type</th>
                  <th className="admin-table-head">Created At</th>
                  <th className="admin-table-head">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((item, index) => {
                  const customerName = item.payload?.address
                    ? `${item.payload.address.firstName || ""} ${item.payload.address.lastName || ""}`.trim()
                    : item.user
                    ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
                    : "N/A";
                  const email = item.payload?.guestEmail || item.payload?.address?.email || item.user?.email || "N/A";
                  const phone = item.payload?.guestPhone || item.payload?.address?.phoneNumber || "N/A";
                  const isLast = index === pendingOrders.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-gray-200";

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className={classes}>{(page - 1) * 10 + index + 1}</td>
                      <td className={`${classes} font-mono text-xs font-semibold text-gray-700`}>
                        {item.razorpay_order_id}
                      </td>
                      <td className={`${classes} font-semibold text-gray-900`}>{customerName}</td>
                      <td className={classes}>{email}</td>
                      <td className={classes}>{phone}</td>
                      <td className={classes}>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.isGuest
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {item.isGuest ? "Guest" : "Registered"}
                        </span>
                      </td>
                      <td className={classes}>{new Date(item.createdAt).toLocaleString()}</td>
                      <td className={classes}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetails(item)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                            title="View Details"
                          >
                            <AiOutlineEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <AiOutlineDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="py-5">
              <Pagination
                handleClick={handleFilter}
                page={page}
                number={10}
                totalNumber={totalAvailablePendingOrders}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white border rounded-xl mt-5">
            <p className="text-gray-500 font-medium">No non-completed orders found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingOrders;
