import React, { useEffect } from "react";
import SideNavbar from "./Components/SideNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SmallDeviceNavbar from "./Components/SmallDeviceNavbar";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="flex lg:flex-row flex-col min-h-screen bg-gray-50">
      <SmallDeviceNavbar />
      <div className="hidden lg:block p-4 flex-shrink-0">
        <SideNavbar />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
