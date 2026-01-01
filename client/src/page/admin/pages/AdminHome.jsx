import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiPackage } from "react-icons/bi";
import { URL } from "../../../Common/api";
import { getImageUrl } from "@/Common/functions";
import { getOrders } from "../../../redux/actions/admin/ordersAction";
import SalesChart from "../Components/DashboardComponents/SalesChart";
import ProfitChart from "../Components/DashboardComponents/ProfitChart";
import UserChart from "../Components/DashboardComponents/UserChart";
import RevenueChart from "../Components/DashboardComponents/RevenueChart";
import MostSoldChart from "../Components/DashboardComponents/MostSoldChart";
import Modal from "../../../components/Modal";
import UpdateOrder from "./Order/UpdateOrder";
import { AiOutlineCalendar } from "react-icons/ai";
import OutsideTouchCloseComponent from "../../../components/OutsideTouchCloseComponent";
import { debounce } from "time-loom";
import { useSearchParams } from "react-router-dom";

const AdminHome = () => {
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [numberOfDates, setNumberOfDates] = useState(7);

  const [dropDown, setDropDown] = useState(false);
  const toggleDropDown = debounce(() => {
    setDropDown(!dropDown);
  }, 100);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  // Update Orders
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = (data) => {
    setUpdateModal(!updateModal);
    setSelectedOrderToUpdate(data);
  };

  return (
    <>
      {updateModal && (
        <Modal
          tab={
            <UpdateOrder
              toggleModal={toggleUpdateModal}
              data={selectedOrderToUpdate}
            />
          }
        />
      )}
  <div className="p-6 w-full overflow-auto bg-gray-50 min-h-screen">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-500 text-lg">Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-semibold pb-6">
          <h2 className="font-bold text-lg text-gray-800 mb-2 sm:mb-0">Dashboard Overview</h2>
          <div className="flex gap-2 relative">
            <button
              className="bg-white border border-gray-200 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
              onClick={toggleDropDown}
            >
              <AiOutlineCalendar className="inline mr-1" />
              Last {numberOfDates} days
            </button>
            {dropDown && (
              <OutsideTouchCloseComponent
                toggleVisibility={toggleDropDown}
                style="absolute top-10 right-0 font-normal w-44 bg-white rounded-lg shadow-2xl"
              >
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setNumberOfDates(7); toggleDropDown(); }}>Last 7 Days</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setNumberOfDates(30); toggleDropDown(); }}>Last 30 Days</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setNumberOfDates(180); toggleDropDown(); }}>Last 180 Days</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setNumberOfDates(365); toggleDropDown(); }}>Last 365 Days</button>
              </OutsideTouchCloseComponent>
            )}
          </div>
        </div>

  <div className="flex lg:flex-row flex-col gap-6 mb-8">
          <SalesChart numberOfDates={numberOfDates} />
          <ProfitChart numberOfDates={numberOfDates} />
          <UserChart numberOfDates={numberOfDates} />
        </div>

  <div className="flex gap-6 lg:flex-row flex-col">
          <RevenueChart numberOfDates={numberOfDates} />
          <div className="bg-white p-6 rounded-lg w-full lg:w-1/3 shadow-sm">
            <h1 className="text-base font-semibold mb-2">Most Sold Items</h1>
            <MostSoldChart numberOfDates={numberOfDates} />
          </div>
        </div>
        {orders && orders.length > 0 ? (
          <div className="mt-8 bg-white w-full rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-800">Latest Orders {orders.length >= 5 ? "(Last 5)" : `(${orders.length} available)`}</h1>
              <Link to="/admin/orders">
                <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm">View All</button>
              </Link>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
              {orders.slice(0, 5).map((order, index) => (
                <div key={order._id || index} className="group relative bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                          <BiPackage className="text-white text-xl" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900 text-base">#{order.orderId || (order._id || '').toString().slice(-8).toUpperCase()}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>{(order.status || '').charAt(0).toUpperCase() + (order.status || '').slice(1)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const totalRaw = order.totalPrice ?? order.totalAmount ?? order.total ?? order.amount ?? order.finalTotal ?? order.grandTotal;
                        const showTotal = totalRaw !== null && totalRaw !== undefined && totalRaw !== "";
                        return (
                          <>
                            <p className="font-semibold text-base text-gray-900">{showTotal ? `₹${Number(totalRaw).toLocaleString()}` : "—"}</p>
                            <p className="text-xs text-gray-500">{order.products?.length || 0} item{order.products?.length !== 1 ? 's' : ''}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {order.products && order.products.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {order.products.slice(0, 3).map((item, itemIndex) => {
                          const product = item.productId || item.product || item;
                          return (
                            <div key={itemIndex} className="w-8 h-8 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                              {product?.imageURL && (
                                <img
                                  src={getImageUrl(product.imageURL, URL)}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                            </div>
                          );
                        })}
                        {order.products.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{order.products.length - 3}</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-500 ml-2">{(() => {
                          const firstProduct = order.products[0];
                          const product = firstProduct?.productId || firstProduct?.product || firstProduct;
                          const firstName = product?.name || 'Product';
                          const totalProducts = order.products.length;
                          if (totalProducts === 1) return firstName;
                          const extraCount = totalProducts - 1;
                          return `${firstName} + ${extraCount} more`;
                        })()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400">{error ? error : "No orders are placed yet"}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
