import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/actions/user/userOrderActions";
import date from "date-and-time";
import { URL } from "../../Common/api";
import EmptyCart from "../../assets/emptyCart.png";
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
            <div className="space-y-4">
              {userOrders.map((item) => {
                // normalize product object (some APIs return productId, others product)
                const first = item.products?.[0] || {};
                const prod = first.productId || first.product || first;

                // try multiple image field names
                const imageName = prod?.imageURL || prod?.image || prod?.img || prod?.thumbnail || prod?.imageUrl || null;

                return (
                  <div key={item._id} className="group relative bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex-shrink-0">
                          {(() => {
                            // prepare preview list from order products array
                            const all = item.products || item.items || [];
                            const previews = all
                              .map((p) => p.productId || p.product || p)
                              .filter(Boolean);

                            if (previews.length <= 1) {
                              const single = previews[0] || prod;
                              const singleImg = single?.imageURL || single?.image || single?.img || single?.thumbnail || single?.imageUrl || null;
                              return singleImg ? (
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                  <img
                                    src={`${URL}/img/${singleImg}`}
                                    alt={single?.name || 'Product'}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = EmptyCart;
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                  <BsArrowRight className="text-gray-400 text-lg transform rotate-90" />
                                </div>
                              );
                            }

                            // multiple previews: show up to 3 stacked small thumbnails
                            const max = 3;
                            const shown = previews.slice(0, max);
                            const extra = previews.length - shown.length;

                            return (
                              <div className="flex -space-x-2">
                                {shown.map((p, idx) => {
                                  const img = p?.imageURL || p?.image || p?.img || p?.thumbnail || p?.imageUrl || null;
                                  return (
                                    <div key={idx} className={`w-8 h-8 rounded-md overflow-hidden ring-2 ring-white bg-gray-100 ${idx === 0 ? '' : ''}`}>
                                      {img ? (
                                        <img
                                          src={`${URL}/img/${img}`}
                                          alt={p?.name || 'Product'}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                          onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = EmptyCart;
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                      )}
                                    </div>
                                  );
                                })}
                                {extra > 0 && (
                                  <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                                    +{extra}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900 text-sm truncate">
                              {(() => {
                                const allProducts = item.products || [];
                                const firstProduct = allProducts[0];
                                const firstName = firstProduct?.productId?.name || firstProduct?.product?.name || firstProduct?.name || 'Product unavailable';
                                const totalProducts = allProducts.length;
                                
                                if (totalProducts === 1) {
                                  return firstName;
                                } else {
                                  const extraCount = totalProducts - 1;
                                  return `${firstName} + ${extraCount} more`;
                                }
                              })()}
                            </p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              item.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}> {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}</span>
                          </div>
                          <p className="text-sm text-gray-500">{date.format(new Date(item.createdAt), "MMM DD YYYY")}</p>
                          <p className="text-xs text-gray-500 mt-1">({item.totalQuantity}) products</p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="font-bold text-gray-900">₹{Number(item.totalPrice).toLocaleString()}</p>
                        <Link to={`detail/${item.orderId || item._id}`} className="inline-flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors duration-200">
                          View Details <BsArrowRight className="text-sm" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
