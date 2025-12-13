import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRocket } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { URL } from "../../../../Common/api";
import { config } from "../../../../Common/configurations";
import ProfileImage from "../../../../components/ProfileImage";

const Dash = () => {
  const { user } = useSelector((state) => state.user);
  const [orderCounts, setOrderCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrderCounts = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/order-count`, config);
      if (data) {
        setOrderCounts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/user/orders?limit=5`, config);
      if (data && data.orders) {
        setRecentOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderCounts();
    loadRecentOrders();
  }, []);

  return (
    <div className="h-[calc(100vh-200px)] px-5 lg:px-0 flex flex-col">
      {/* Greeting Section */}
      {user && (
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your account activity and recent orders.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
        <div className="bg-white w-full p-6 rounded-2xl  border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <FaRocket className="text-2xl text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-gray-900 mb-1">{orderCounts.totalOrders || 0}</p>
              <p className="text-sm font-medium text-blue-600">Total Orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white w-full p-6 rounded-2xl  border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl">
              <BiMessageSquareDetail className="text-2xl text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {orderCounts.pendingOrders || 0}
              </p>
              <p className="text-sm font-medium text-orange-600">
                Pending Orders
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white w-full p-6 rounded-2xl  border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-2xl">
              <BiPackage className="text-2xl text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {orderCounts.completedOrders || 0}
              </p>
              <p className="text-sm font-medium text-green-600">
                Completed Orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <>
          
          <p className="lg:w-3/5 mt-5 text-gray-500 flex-shrink-0">
            From your account dashboard. you can easily check & view your{" "}
            <Link className="dashboard-link" to="order-history">
              Recent Orders
            </Link>
            , manage your{" "}
            <Link className="dashboard-link" to="addresses">
              Shipping and Billing Addresses
            </Link>{" "}
            and edit your{" "}
            <Link className="dashboard-link" to="settings">
              Password
            </Link>{" "}
            and{" "}
            <Link className="dashboard-link" to="profile">
              Account Details.
            </Link>
          </p>
          <div className="mt-5 flex-1 min-h-0">
            <div className="bg-white w-full rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Recent Orders</h1>
                <p className="text-sm text-gray-500 mt-1">Track your latest purchases</p>
              </div>
              <div className={`p-6 flex-1 ${recentOrders.length > 0 ? 'overflow-y-auto' : 'flex items-center justify-center overflow-hidden'}`}>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div key={order._id} className="group relative bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                <BiPackage className="text-white text-xl" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-900 text-base">
                                  #{order._id.slice(-8).toUpperCase()}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              ₹{Number(order.totalAmount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {/* Order items preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {order.items.slice(0, 3).map((item, itemIndex) => (
                                <div key={itemIndex} className="w-8 h-8 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                  {item.product?.imageURL && (
                                    <img 
                                      src={`${URL}/img/${item.product.imageURL}`} 
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm text-gray-500 ml-2">
                                {order.items[0]?.product?.name}
                                {order.items.length > 1 && ` & ${order.items.length - 1} more`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <Link to="order-history">
                        <button className="w-full bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium text-sm">
                          View All Orders
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BiPackage className="text-lg text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-xs text-gray-500 mb-4">Start shopping to see your orders here</p>
                    <Link to="/">
                      <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm">
                        Start Shopping
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="bg-white w-full border rounded">
              <h1 className="text-lg px-5 py-3 font-semibold border-b">
                Address
              </h1>
              <div className="p-5">
                <div className="flex gap-2 items-center pb-3">
                  <div className="w-12 h-12 rounded-full overflow-clip">
                    <img
                      src={`${URL}/img/${user.profileImgURL}`}
                      alt="safdas"
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <p className="font-semibold">
                  Email: <span className="text-gray-500">{user.email}</span>
                </p>
                <p className="font-semibold">
                  Phone No:{" "}
                  <span className="text-gray-500">{user.phoneNumber}</span>
                </p>
                <Link to="profile">
                  <button className="btn-blue-border my-2">Edit Account</button>
                </Link>
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Dash;
