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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-500 font-medium">No global settings are currently configurable.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
