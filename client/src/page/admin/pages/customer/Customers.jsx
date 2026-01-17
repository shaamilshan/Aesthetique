import React, { useEffect, useState } from "react";
import { BsCaretRightFill, BsFilterRight } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCustomers } from "../../../../redux/actions/admin/customerAction";
import TableRow from "./TableRow";
import BlockOrUnBlock from "./BlockOrUnBlock";
import CreateCustomerForm from "./CreateCustomerForm";
import Modal from "../../../../components/Modal";
import FilterArray from "../../Components/FilterArray";
import SearchBar from "../../../../components/SearchBar";
import Pagination from "../../../../components/Pagination";
import RangeDatePicker from "../../../../components/RangeDatePicker";
import ClearFilterButton from "../../Components/ClearFilterButton";

const Customers = () => {
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
  const [createModal, setCreateModal] = useState(false);

  const openCreateModal = () => setCreateModal(true);
  const closeCreateModal = () => setCreateModal(false);

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
    params.delete("role");
    params.delete("startingDate");
    params.delete("endingDate");
    setSearch("");
    setStartingDate("");
    setEndingDate("");
    setSearchParams(params);
  };

  useEffect(() => {
    dispatch(getCustomers(searchParams));
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams]);

  // Helper: compute initials for avatar fallback
  const getInitials = (c) => {
    const name = (c.firstName || "") + " " + (c.lastName || "");
    const full = (c.name || name || c.email || "").trim();
    const parts = full.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

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
            <h1 className="font-bold text-2xl">Users</h1>
            <div className="flex items-center gap-2 mt-2 mb-4 text-gray-500">
              <p className="text-blue-500 font-semibold">Dashboard</p>
              <span>
                <BsCaretRightFill />
              </span>
              <p className="font-semibold">Users List</p>
            </div>
          </div>
        </div>
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center font-semibold gap-3 lg:gap-0">
          <div className="flex items-center gap-4">
            <FilterArray
              list={["all", "active", "blocked"]}
              handleClick={handleFilter}
            />

            {/* Role filter: pill-style */}
            <div className="flex items-center gap-2">
              {['all', 'user', 'admin', 'superAdmin'].map((r) => {
                const params = new URLSearchParams(window.location.search);
                const activeRole = params.get('role') || 'all';
                const active = activeRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleFilter('role', r === 'all' ? '' : r)}
                    className={`px-3 py-1 text-sm rounded-full border ${active ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'} hover:shadow-sm`}
                  >
                    {r === 'superAdmin' ? 'SuperAdmin' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap my-2 gap-3 items-center">
            <RangeDatePicker
              handleFilter={handleFilter}
              startingDate={startingDate}
              setStartingDate={setStartingDate}
              endingDate={endingDate}
              setEndingDate={setEndingDate}
            />
            <ClearFilterButton handleClick={removeFilters} />
            <button
              onClick={openCreateModal}
              className="ml-4 btn-blue text-white px-4 py-2 rounded-lg text-sm"
            >
              Create New User
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Desktop / tablet: table view */}
          <div className="hidden md:block">
            {customers && (
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Actions</th>
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

          {/* Mobile: stacked card view */}
          <div className="block md:hidden">
            {customers && customers.map((customer, index) => (
              <div key={customer._id || index} className="px-4 py-4 border-b last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">{getInitials(customer)}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{(customer.firstName || customer.lastName) ? `${(customer.firstName || '')} ${(customer.lastName || '')}`.trim() : customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}</div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : customer.role === 'superAdmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {customer.role ? (customer.role === 'superAdmin' ? 'SuperAdmin' : customer.role.charAt(0).toUpperCase() + customer.role.slice(1)) : 'User'}
                    </div>
                    <div className="text-sm text-gray-700">{customer.phoneNumber || '-'}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Hide actions for plain users - no role editing needed */}
                    {(customer.role && customer.role !== 'user') ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBlockUnBlockModal({ id: customer._id, status: customer.isActive, role: customer.role });
                        }}
                        className="text-sm px-3 py-1 rounded border border-gray-200 bg-white hover:shadow-sm"
                      >
                        Actions
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">&mdash;</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      {createModal && (
        <Modal
          tab={
            <CreateCustomerForm
              onClose={() => {
                closeCreateModal();
              }}
            />
          }
          onClose={closeCreateModal}
        />
      )}
    </>
  );
};

export default Customers;

// CreateCustomerForm has been moved to its own file for clarity
