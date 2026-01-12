import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { commonRequest } from "../../../../Common/api";
import { appJson } from "../../../../Common/configurations";
import { useDispatch } from "react-redux";
import { getCustomers } from "../../../../redux/actions/admin/customerAction";

const BlockOrUnBlock = ({ toggleModal, data }) => {
  const { id, status, role } = data || {};
  const [selectedStatus, setSelectedStatus] = useState(
    status ? "active" : "blocked"
  );

  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState(role || "user");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const isActive = selectedStatus === "active";
      await commonRequest(
        "patch",
        `/admin/customer/${id}`,
        { isActive, role: selectedRole },
        appJson
      );
  // refresh list so UI shows updated role/status
  dispatch(getCustomers());
  toggleModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-2/6 bg-white p-5 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Block User</h1>
        <AiOutlineClose
          className="text-2xl cursor-pointer hover:text-gray-500"
          onClick={() => toggleModal()}
        />
      </div>
      <div className="flex gap-3 items-center my-2">
        <p className="py-5 shrink-0">Choose a Status</p>
        <select
          name="status"
          id="status"
          className="capitalize px-5 py-2 w-full bg-gray-300 rounded-lg"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="active" className="capitalize">
            active
          </option>
          <option value="blocked" className="capitalize">
            blocked
          </option>
        </select>
      </div>
      <div className="flex flex-col gap-3 items-start my-2">
        <div className="w-full">
          <p className="py-2 text-sm font-medium">Role</p>
          <select
            name="role"
            id="role"
            className="px-5 py-2 w-full bg-gray-100 rounded-lg"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="user">user</option>
            <option value="superAdmin">superAdmin</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
      <button
        className="btn-blue text-white uppercase w-full text-sm"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default BlockOrUnBlock;
