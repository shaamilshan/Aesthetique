import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../../components/Modal";
import {
  getManagerOrders,
  getOrders,
} from "../../../../redux/actions/admin/ordersAction";
import UpdateOrder from "./UpdateOrder";
import FilterArray from "../../Components/FilterArray";
import ReturnRequestsButtonInOrders from "./ReturnRequestsButtonInOrders";
import ExportModal from "../../Components/ExportModal/ExportModal";
import OrderTableRow from "../../Components/OrderTableRow";
import JustLoading from "../../../../components/JustLoading";
import { useParams, useSearchParams } from "react-router-dom";
import SearchBar from "../../../../components/SearchBar";
import Pagination from "../../../../components/Pagination";
import RangeDatePicker from "../../../../components/RangeDatePicker";
import ClearFilterButton from "../../Components/ClearFilterButton";
import toast from "react-hot-toast";
import axios from "axios";
import { URL } from "@/Common/api";

const AllManagerOrders = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // const { orders, loading, error, totalAvailableOrders } = useSelector(
  //   (state) => state.orders
  // );
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(true);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = (data) => {
    if (data.status === "cancelled") {
      toast.error("Cannot Edit Cancelled Product");
      return;
    }
    if (data.status === "returned") {
      toast.error("Cannot Edit Returned Product");
      return;
    }
    setUpdateModal(!updateModal);
    setSelectedOrderToUpdate(data);
  };

  // Filtering
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (type, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      if (type === "page") {
        setPage(1);
      }
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

  // Removing filters
  const removeFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    params.delete("page");
    params.delete("status");
    params.delete("startingDate");
    params.delete("endingDate");
    setSearch("");
    setStartingDate("");
    setEndingDate("");
    setSearchParams(params);
  };

  // Filters setting initially
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, []);
  const { user } = useSelector((state) => state.user);

  // Getting all the orders on page load
  useEffect(() => {
    console.log("user");
    console.log(user);
    async function fetchmo(params) {
      const { data } = await axios.get(`${URL}/manager/orders/a/${id}/${searchParams && `?${searchParams}`}`, {
        withCredentials: true,
      });
      console.log("data orders");
      console.log(data);
      setorders(data.orders)
      setloading(false)
    }
    fetchmo();
    // dispatch(getManagerOrders({ queries: searchParams, userId: id }));
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams]);
  console.log(orders);

  // Export Modal
  const [showExportModal, setShowExportModal] = useState(false);
  const toggleExportModal = () => {
    setShowExportModal(!showExportModal);
  };

  return (
    <>
      <div className="p-5 w-full overflow-y-auto text-sm">
        <h1 className="font-bold text-2xl mb-4">Manager Orders</h1>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <JustLoading size={10} />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="overflow-x-scroll bg-white rounded-lg">
            <table className="w-full min-w-max table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left">No</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Order Date</th>
                  {/* <th className="p-4 text-left">Customer</th> */}
                  <th className="p-4 text-left">Total</th>
                  {/* <th className="p-4 text-left">Status</th> */}
                </tr>
              </thead>
              <tbody>
                {orders.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{item.productName}</td>
                    <td className="p-4">
                      {new Date(item.orderDate).toLocaleDateString()}
                    </td>
                    {/* <td className="p-4">{item.customerName}</td> */}
                    <td className="p-4">${item.totalPrice}</td>
                    {/* <td className="p-4">{item.status}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AllManagerOrders;
