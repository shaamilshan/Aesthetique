import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { blockOrUnBlock } from "../../../../redux/actions/superAdmin/adminAction";
import { useDispatch } from "react-redux";

const BlockOrUnBlock = ({ toggleModal, data }) => {
  const { id, status } = data;
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(
    status ? "active" : "blocked"
  );

  const handleSave = () => {
    if (selectedStatus === "") {
      return;
    }
    let isActive = selectedStatus === "active";

    dispatch(blockOrUnBlock({ id, isActive })).then(() => toggleModal());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-2xl overflow-visible"
    >
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-xl font-semibold">Block User</h1>
        <button
          aria-label="Close"
          onClick={() => toggleModal("")}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <AiOutlineClose className="text-2xl text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <label className="text-sm text-gray-600">Choose a status</label>
        <div>
          <select
            name="status"
            id="status"
            className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="active" className="capitalize">
              Active
            </option>
            <option value="blocked" className="capitalize">
              Blocked
            </option>
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => toggleModal("")}
            className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-lg bg-black text-white text-sm font-medium hover:opacity-95 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockOrUnBlock;
