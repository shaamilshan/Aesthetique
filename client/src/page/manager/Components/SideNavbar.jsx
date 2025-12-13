import React, { useState } from "react";
import ExIphoneLogo from "../../../components/ExIphoneLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home,
  MessageSquare,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  ChevronRight
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
        <div className="mb-8">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-4">
            <div className={`opacity-80 hover:opacity-100 transition-opacity ${isExpanded ? 'w-10 h-10' : 'w-8 h-8'}`}>
              <ExIphoneLogo />
            </div>
          </div>
          
          {/* Title Section (only when expanded) */}
          {isExpanded && (
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Manager Panel</h2>
            </div>
          )}
          
          {/* Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? (
                <ChevronLeft size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavLink
            to="/manager/"
            end
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-3 py-3' 
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
            to="enquiries"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-3 py-3' 
                  : 'justify-center px-2 py-3'
              } ${
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            title={!isExpanded ? "Enquiries" : ""}
          >
            <MessageSquare size={20} className="flex-shrink-0" />
            {isExpanded && <span>Enquiries</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Enquiries
              </div>
            )}
          </NavLink>

          <NavLink
            to="orders"
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-colors relative group ${
                isExpanded 
                  ? 'gap-3 px-3 py-3' 
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
        </nav>

        {/* Bottom section with logout */}
        <div className="pt-4 border-t border-gray-200">
          <button
            className={`flex items-center rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full relative group ${
              isExpanded 
                ? 'gap-3 px-3 py-3' 
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
