import React, { useEffect } from "react";
import SideNavbar from "./Components/SideNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SmallDeviceNavbar from "./Components/SmallDeviceNavbar";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If there's a token but `user` is not yet populated, we're still loading
    // — do not redirect away. Only redirect when there's definitely no
    // authenticated user (no token) or when a non-authorized user lands here.
    if (!token && !user) {
      navigate("/");
      return;
    }

    if (user && user.role && user.role !== "superAdmin") {
      // Authenticated but not a superAdmin — send them away
      navigate("/");
      return;
    }

    // Debug: log mounting and user role to help diagnose blank /manager
    // eslint-disable-next-line no-console
    console.log("[ManagerDash] mounted, user:", user);
  }, [user]);

  return (
    <div className="flex lg:flex-row flex-col overflow-y-hidden h-screen bg-gray-50">
      <SmallDeviceNavbar />
      <div className="hidden lg:block p-4 flex-shrink-0">
        <SideNavbar />
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
