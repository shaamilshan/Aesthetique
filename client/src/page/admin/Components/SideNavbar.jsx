import React, { useState } from "react";
import ExIphoneLogo from "../../../components/ExIphoneLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home,
  Package,
  Grid3X3,
  ShoppingBag,
  CreditCard,
  LogOut,
  Users,
  ChevronLeft,
  ChevronRight,
  Ticket
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/userActions";
import { clearUserState } from "@/redux/reducers/userSlice";

const SideNavbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white h-full shrink-0 rounded-lg shadow-sm border transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} flex flex-col`}>
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          {/* Logo Section */}
          <div className={`flex items-center mb-3 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <div className={`opacity-80 hover:opacity-100 transition-opacity ${isExpanded ? 'w-16 h-16' : 'w-8 h-8'}`}>
              <ExIphoneLogo />
            </div>
          </div>
          
          {/* Title and Toggle Section */}
          {isExpanded ? (
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-800">Admin Panel</h2>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          <NavLink
            to="/admin/"
            end
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Dashboard" : ""}
          >
            <Home size={20} className="flex-shrink-0" />
            {isExpanded && <span>Dashboard</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Dashboard
              </div>
            )}
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Products" : ""}
          >
            <Package size={20} className="flex-shrink-0" />
            {isExpanded && <span>Products</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Products
              </div>
            )}
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Categories" : ""}
          >
            <Grid3X3 size={20} className="flex-shrink-0" />
            {isExpanded && <span>Categories</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Categories
              </div>
            )}
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Orders" : ""}
          >
            <ShoppingBag size={20} className="flex-shrink-0" />
            {isExpanded && <span>Orders</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Orders
              </div>
            )}
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Payments" : ""}
          >
            <CreditCard size={20} className="flex-shrink-0" />
            {isExpanded && <span>Payments</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Payments
              </div>
            )}
          </NavLink>

          <NavLink
            to="/admin/coupon"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Voucher Codes" : ""}
          >
            <Ticket size={20} className="flex-shrink-0" />
            {isExpanded && <span>Voucher Codes</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Voucher Codes
              </div>
            )}
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-4 py-2.5' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Customers" : ""}
          >
            <Users size={20} className="flex-shrink-0" />
            {isExpanded && <span>Customers</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Customers
              </div>
            )}
          </NavLink>
        </nav>

        {/* Bottom section with logout */}
        <div className="pt-3 border-t border-gray-200 mt-4">
          <button
            className={`flex items-center rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full relative group ${
              isExpanded 
                ? 'gap-3 px-4 py-2.5' 
                : 'justify-center px-2 py-3'
            }`}
            onClick={handleLogout}
            title={!isExpanded ? "Logout" : ""}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isExpanded && <span>Logout</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
