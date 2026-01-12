import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewCustomer, getCustomers } from "../../../../redux/actions/admin/customerAction";

const CreateCustomerForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { user: currentUser } = useSelector((state) => state.user);
  // granular actions per feature
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
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !email || !password || !role) {
      setError("First name, email, password and role are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", firstName);
      if (lastName) formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("isEmailVerified", "true");
      // append permissions if role is admin and current user is superAdmin
      if (role === "admin" && currentUser && currentUser.role === "superAdmin") {
        // submit each permission as a separate field so server can parse FormData
        selectedPermissions.forEach((p) => formData.append("permissions", p));
      }

      await dispatch(createNewCustomer(formData)).unwrap();

      // Refresh the customers list so the newly created user appears immediately.
      dispatch(getCustomers());

      onClose();
    } catch (err) {
      const message =
        (err && (err.message || err.error)) ||
        (typeof err === "string" ? err : null) ||
        (err && err.toString && err.toString()) ||
        "Unable to create customer";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-start justify-center">
  <div className="max-w-4xl lg:max-w-6xl w-full bg-white p-6 rounded-xl shadow-lg relative h-full overflow-auto">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100"
      >
        ✕
      </button>

      <div className="mb-4">
        <h1 className="text-lg font-semibold">Create User</h1>
        <p className="text-sm text-gray-500">Create a new user account for the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-2 grid grid-cols-1 gap-4">
        <label className="block">
          <span className="text-sm text-gray-600">First name</span>
          <input
            className="mt-1 block w-full rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Last name (optional)</span>
          <input
            className="mt-1 block w-full rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Email</span>
          <input
            className="mt-1 block w-full rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="user@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Password</span>
          <input
            className="mt-1 block w-full rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter a strong password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="user">user</option>
            <option value="superAdmin">superAdmin</option>
            <option value="admin">admin</option>
          </select>
        </label>

        {/* Permission selector: grouped feature cards with action chips - visible only when creating an admin and the current user is superAdmin */}
        {role === "admin" && currentUser && currentUser.role === "superAdmin" && (
          <div className="block">
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-100 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateCustomerForm;
