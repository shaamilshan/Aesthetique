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
    <div className="flex lg:flex-row flex-col h-screen overflow-hidden bg-gray-50">
      <SmallDeviceNavbar />
      <div className="hidden lg:block p-4 flex-shrink-0 h-full overflow-y-auto">
        <SideNavbar />
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
