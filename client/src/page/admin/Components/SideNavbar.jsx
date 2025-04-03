import React from "react";
import ExIphoneLogo from "../../../components/ExIphoneLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { FiBox, FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { HiOutlineTicket } from "react-icons/hi";
import { BsCardChecklist, BsCreditCard } from "react-icons/bs";
import { AiOutlineTags } from "react-icons/ai";
import { FaUsersCog, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/userActions";
import { clearUserState } from "@/redux/reducers/userSlice";

const SideNavbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <div className="w-14 mt-4 flex items-center cursor-pointer opacity-70 hover:opacity-100">
        <ExIphoneLogo />
      </div>
      <div className="text-gray-600 font-semibold mt-5">
      <NavLink
  to="/admin/"
  end
  className={({ isActive }) =>
    `flex px-3 py-2 rounded items-center gap-4 hover:bg-gray-300 hover:text-[#A53030] ${
      isActive ? "bg-gray-200 text-[#A53030] font-semibold" : "text-black"
    }`
  }
>
  <RiDashboardLine />
  Dashboard
</NavLink>


        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex px-3 py-2 rounded items-center gap-4 hover:bg-gray-300 hover:text-[#A53030] ${
              isActive ? "bg-gray-200 text-[#A53030] font-semibold" : "text-black"
            }`
          }
        >
          <FiBox />
          Products
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `flex px-3 py-2 rounded items-center gap-4 hover:bg-gray-300 hover:text-[#A53030] ${
              isActive ? "bg-gray-200 text-[#A53030] font-semibold" : "text-black"
            }`
          }
        >
          <ImStack />
          Category
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex px-3 py-2 rounded items-center gap-4 hover:bg-gray-300 hover:text-[#A53030] ${
              isActive ? "bg-gray-200 text-[#A53030] font-semibold" : "text-black"
            }`
          }
        >
          <BsCardChecklist />
          Orders
        </NavLink>

        <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            `flex px-3 py-2 rounded items-center gap-4 hover:bg-gray-300 hover:text-[#A53030] ${
              isActive ? "bg-gray-200 text-[#A53030] font-semibold" : "text-black"
            }`
          }
        >
          <BsCreditCard />
          Payments
        </NavLink>

        <button
          className="flex px-3 py-2 rounded items-center gap-4 hover:bg-gray-200 hover:text-[#A53030] w-full"
          onClick={handleLogout}
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </>
  );
};

export default SideNavbar;
