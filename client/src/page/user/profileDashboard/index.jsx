import React from "react";
import { Outlet } from "react-router-dom";
import DashSideNavbar from "../../../components/User/DashSideNavbar";

const ProfileDashboard = () => {
  return (
    <div className="sm:flex gap-5 sm:py-20 lg:px-40 min-h-screen sm:bg-gray-100">
      <DashSideNavbar />
      <Outlet />
    </div>
  );
};

export default ProfileDashboard;
