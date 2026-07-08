import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { commonRequest } from "../../../Common/api";
import { Percent, Save, ToggleLeft, ToggleRight, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [percentage, setPercentage] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await commonRequest("GET", "/admin/setting/first_signup_discount");
        if (response && response.value) {
          if (typeof response.value === "object") {
            setPercentage(response.value.discount || 0);
            setIsActive(!!response.value.isActive);
          } else if (typeof response.value === "number") {
            setPercentage(response.value);
            setIsActive(response.value > 0);
          }
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (percentage < 0 || percentage > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        value: {
          discount: Number(percentage),
          isActive: isActive,
        },
      };
      const response = await commonRequest("PUT", "/admin/setting/first_signup_discount", payload);
      if (response && !response.error) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error(response?.error || "Failed to update settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-black text-white rounded-2xl shadow-sm">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Configure global store behavior and policies.</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card: First Sign-In Discount */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Percent className="text-black" size={20} />
                    First Sign-In Discount
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Configure a percentage discount automatically applied to a user's first purchase.
                  </p>
                </div>
                
                {/* Active Toggle Switch */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${isActive ? "text-green-600" : "text-gray-400"}`}>
                    {isActive ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="focus:outline-none transition-colors duration-200"
                  >
                    {isActive ? (
                      <ToggleRight className="text-green-500 hover:text-green-600 cursor-pointer" size={44} />
                    ) : (
                      <ToggleLeft className="text-gray-300 hover:text-gray-400 cursor-pointer" size={44} />
                    )}
                  </button>
                </div>
              </div>

              {/* Form Controls */}
              <div className="pt-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="discountPercentage" className="text-sm font-bold text-gray-700">
                    Discount Percentage
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      id="discountPercentage"
                      min="0"
                      max="100"
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none font-semibold text-lg"
                      placeholder="0"
                      value={percentage}
                      onChange={(e) => setPercentage(Math.max(0, Math.min(100, Number(e.target.value))))}
                      disabled={!isActive}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-bold text-lg">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Entering 10 means customers will get a 10% discount on their subtotal before checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 focus:outline-none font-semibold shadow-sm transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
