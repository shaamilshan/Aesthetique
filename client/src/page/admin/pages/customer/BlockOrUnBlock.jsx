import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { commonRequest } from "../../../../Common/api";
import { appJson } from "../../../../Common/configurations";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../../../../redux/actions/admin/customerAction";

const BlockOrUnBlock = ({ toggleModal, data }) => {
  const { id, status, role } = data || {};
  const [selectedStatus, setSelectedStatus] = useState(status ? "active" : "blocked");

  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((s) => s.user || {});
  const [selectedRole, setSelectedRole] = useState(role || "user");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // available features (kept in sync with CreateCustomerForm)
  const FEATURES = [
    { key: "dashboard", label: "Dashboard", actions: ["view"] },
    { key: "products", label: "Products", actions: ["add", "edit", "delete"] },
    { key: "categories", label: "Categories", actions: ["add", "edit", "delete"] },
    { key: "orders", label: "Orders", actions: ["view", "edit"] },
    { key: "payments", label: "Payments", actions: ["view", "clear"] },
    { key: "coupons", label: "Voucher Codes", actions: ["add", "edit", "delete"] },
    { key: "users", label: "Users", actions: ["add", "edit", "delete"] },
    { key: "banners", label: "Banners", actions: ["add", "edit", "delete"] },
    { key: "announcements", label: "Announcements", actions: ["add", "edit", "delete"] },
    { key: "faqs", label: "FAQs", actions: ["add", "edit", "delete"] },
  ];

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const isActive = selectedStatus === "active";

      const body = { isActive, role: selectedRole };

      // if promoting to admin and current user is superAdmin, include permissions
      if (selectedRole === "admin" && currentUser && currentUser.role === "superAdmin") {
        body.permissions = selectedPermissions;
      }

      await commonRequest("patch", `/admin/customer/${id}`, body, appJson);

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
    <div className="h-full w-full flex items-start justify-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-lg relative h-full overflow-auto">
        <button
          onClick={() => toggleModal()}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100"
        >
          <AiOutlineClose />
        </button>

        <div className="mb-4">
          <h1 className="text-lg font-semibold">Edit User</h1>
          <p className="text-sm text-gray-500">Update role, status and feature access.</p>
        </div>

        <div className="flex gap-3 items-center my-2">
          <p className="py-2 shrink-0">Choose a Status</p>
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

        {/* Show granular permission selector when role=admin and current user is superAdmin */}
        {selectedRole === "admin" && currentUser && currentUser.role === "superAdmin" && (
          <div className="block my-3">
            <p className="text-sm text-gray-600 mb-3">Assign granular permissions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => {
                const featurePerms = f.actions.map((a) => `${f.key}:${a}`);
                const allSelected = featurePerms.every((p) => selectedPermissions.includes(p));

                const togglePerm = (perm) => {
                  setSelectedPermissions((s) => (s.includes(perm) ? s.filter((x) => x !== perm) : [...s, perm]));
                };

                const toggleSelectAll = () => {
                  setSelectedPermissions((s) => {
                    if (allSelected) {
                      // remove all feature perms
                      return s.filter((x) => !featurePerms.includes(x));
                    }
                    // add missing perms
                    const toAdd = featurePerms.filter((p) => !s.includes(p));
                    return [...s, ...toAdd];
                  });
                };

                return (
                  <div key={f.key} className="border p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{f.label}</p>
                      <label className="inline-flex items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2"
                          aria-label={`Select all permissions for ${f.label}`}
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                        <span className="text-xs text-gray-600">Select all</span>
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {f.actions.map((action) => {
                        const permKey = `${f.key}:${action}`;
                        const active = selectedPermissions.includes(permKey);
                        return (
                          <button
                            key={permKey}
                            type="button"
                            onClick={() => togglePerm(permKey)}
                            aria-pressed={active}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                              active
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {action}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            className="btn-blue text-white uppercase w-full text-sm"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockOrUnBlock;
