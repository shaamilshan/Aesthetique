import React from "react";
import { useSelector } from "react-redux";

const ManagerHome = () => {
  const { user } = useSelector((state) => state.user);

  // Debug: confirm ManagerHome renders
  // eslint-disable-next-line no-console
  console.log("[ManagerHome] render, user:", user);

  return (
    <>
      <div className="p-5 w-full overflow-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600">Here's your management overview for today.</p>
        </div>
        
        <div className="flex justify-between items-center text-xs font-semibold pb-5">
          <div>
            <h2 className="font-bold text-xl text-gray-800">Manager Dashboard</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerHome;
