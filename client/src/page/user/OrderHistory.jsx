import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/actions/user/userOrderActions";
import date from "date-and-time";
import { Link, useSearchParams } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import StatusComponent from "../../components/StatusComponent";
import JustLoading from "../../components/JustLoading";
import Pagination from "../../components/Pagination";

const OrderHistory = () => {
  const { userOrders, loading, error, totalAvailableOrders } = useSelector(
    (state) => state.userOrders
  );
  const dispatch = useDispatch();

  // Pagination
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const handleFilter = (type, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      params.delete(type);
    } else {
      if (type === "page" && value === 1) {
        params.delete(type);
        setPage(1);
      } else {
        params.set(type, value);
        if (type === "page") {
          setPage(value);
        }
      }
    }
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  };

  useEffect(() => {
    dispatch(getOrders(searchParams));
    const params = new URLSearchParams(window.location.search);
    const pageNum = params.get("page");
    setPage(parseInt(pageNum) || 1);
  }, [searchParams]);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full mx-5 lg:mx-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">Track all your past orders</p>
        </div>
        <div className="p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
            </div>
          ) : userOrders && userOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-sm">
                <thead>
                  <tr className="bg-gray-50 rounded-xl">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Product Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userOrders &&
                    userOrders.map((item, index) => {
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-semibold text-gray-900 w-60 line-clamp-1">
                                  {item.products[0]?.productId?.name || "Product unavailable"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ({item.totalQuantity}) products
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusComponent status={item.status} />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900 font-medium">
                              {date.format(new Date(item.createdAt), "MMM DD YYYY")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900">₹{item.totalPrice}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={`detail/${item.orderId || item._id}`}
                              className="inline-flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors duration-200"
                            >
                              View Details <BsArrowRight className="text-sm" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BsArrowRight className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500">Your order history will appear here</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination
            handleClick={handleFilter}
            number={10}
            page={page}
            totalNumber={totalAvailableOrders}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
