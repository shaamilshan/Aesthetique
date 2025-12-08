import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";
import { 
  Home,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { useDispatch } from "react-redux";

const DashSideNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="sm:w-1/5 bg-white h-fit shrink-0 rounded-lg shadow-sm border lg:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Dashboard</h2>
        
        <nav className="space-y-2">
          {/* Dashboard NavLink - `end` prevents staying active on sub-routes */}
          <NavLink
            to="/dashboard/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Home size={20} />
            Dashboard
          </NavLink>

          <NavLink 
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            to="order-history"
          >
            <ShoppingBag size={20} />
            Orders
          </NavLink>

          <NavLink 
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            to="wishlist"
          >
            <Package size={20} />
            Products
          </NavLink>

          <NavLink 
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            to="profile"
          >
            <Users size={20} />
            Customers
          </NavLink>

          <NavLink 
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            to="addresses"
          >
            <Settings size={20} />
            Settings
          </NavLink>

          <button 
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashSideNavbar;
