import React, { useEffect, useState } from "react";
import { BsCaretRightFill, BsFilterRight } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers, getManagers } from "../../../../redux/actions/admin/customerAction";
import TableRow from "./TableRow";
import BlockOrUnBlock from "./BlockOrUnBlock";
import Modal from "../../../../components/Modal";
import FilterArray from "../../Components/FilterArray";
import SearchBar from "../../../../components/SearchBar";
import Pagination from "../../../../components/Pagination";
import RangeDatePicker from "../../../../components/RangeDatePicker";
import ClearFilterButton from "../../Components/ClearFilterButton";

const Managers = () => {
  const dispatch = useDispatch();

  const { customers, loading, error, totalAvailableUsers } = useSelector(
    (state) => state.customers
  );

  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState({});
  const [blockUnBlockModal, setBlockUnBlockModal] = useState(false);
  const toggleBlockUnBlockModal = (data) => {
    setBlockUnBlockModal(!blockUnBlockModal);
    setSelectedOrderToUpdate(data);
  };

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

  useEffect(() => {
    dispatch(getManagers(searchParams));
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams]);

  return (
    <>
      {blockUnBlockModal && (
        <Modal
          tab={
            <BlockOrUnBlock
              toggleModal={toggleBlockUnBlockModal}
              data={selectedOrderToUpdate}
            />
          }
        />
      )}
  <div className="p-5 w-full min-h-screen overflow-x-hidden md:overflow-visible text-sm">
        <SearchBar
          handleClick={handleFilter}
          search={search}
          setSearch={setSearch}
        />
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-semibold gap-3 md:gap-0">
          <div>
            <h1 className="font-bold text-2xl">Super Admins</h1>
            <div className="flex items-center gap-2 mt-2 mb-4 text-gray-500">
              <p className="text-blue-500 font-semibold">Dashboard</p>
              <span>
                <BsCaretRightFill />
              </span>
              <p className="font-semibold">Super Admin List</p>
            </div>
          </div>
        </div>
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center font-semibold gap-3 lg:gap-0">
          <FilterArray
            list={["all", "active", "blocked"]}
            handleClick={handleFilter}
          />
          <div className="flex flex-wrap my-2 gap-3">
            <RangeDatePicker
              handleFilter={handleFilter}
              startingDate={startingDate}
              setStartingDate={setStartingDate}
              endingDate={endingDate}
              setEndingDate={setEndingDate}
            />
            <ClearFilterButton handleClick={removeFilters} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {customers && (
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="text-right px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">View</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((customer, index) => {
                  const isLast = index === customers.length - 1;

                  return (
                    <TableRow
                      isLast={isLast}
                      customer={customer}
                      key={customer._id || index}
                      toggleBlockUnBlockModal={toggleBlockUnBlockModal}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="py-5">
          <Pagination
            handleClick={handleFilter}
            page={page}
            number={10}
            totalNumber={totalAvailableUsers}
          />
        </div>
      </div>
    </>
  );
};

export default Managers;
