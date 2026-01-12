import React, { useState } from "react";
import logo from "../../../assets/others/bm-logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home,
  Package,
  Grid3X3,
  ShoppingBag,
  CreditCard,
  LogOut,
  Users,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Image
} from "lucide-react";
import { Megaphone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/userActions";

const SideNavbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine if a sidebar item should be visible for the current user
  const isVisible = (key) => {
    if (!user) return false;
    if (user.role === "superAdmin") return true;
    if (key === "dashboard") return true;
    if (!user.permissions || !Array.isArray(user.permissions)) return false;
    // allow section-level permission (e.g., 'products') or action-level ('products:add')
    if (user.permissions.includes(key)) return true;
    return user.permissions.some((p) => p.startsWith(key + ":"));
  };

  return (
  <div className={`bg-white h-full shrink-0 shadow-md transition-all duration-300 ${isExpanded ? 'w-56' : 'w-14'} flex flex-col`}>
  <div className="p-3 flex-1 flex flex-col">
        {/* Header */}
  <div className="mb-4">
          {/* Logo Section */}
          <div className={`flex items-center mb-2 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <img 
              src={logo}
              alt="logo"
              className={`opacity-90 ${isExpanded ? 'w-12 h-12' : 'w-8 h-8'} object-contain`}
              style={{ display: "block" }}
            />
          </div>
          
          {/* Title and Toggle Section */}
          {isExpanded ? (
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-gray-900 tracking-wide uppercase">Admin Panel</h2>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded hover:bg-gray-100"
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} className="text-gray-500" />
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

          {isVisible("products") && (
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
          )}

          {isVisible("categories") && (
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
          )}

          {isVisible("orders") && (
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
          )}

          {isVisible("payments") && (
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
          )}

          {isVisible("coupons") && (
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
          )}

          {isVisible("users") && (
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
            title={!isExpanded ? "Users" : ""}
          >
            <Users size={20} className="flex-shrink-0" />
            {isExpanded && <span>Users</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Users
              </div>
            )}
          </NavLink>
          )}

          {isVisible("banners") && (
          <NavLink
            to="/admin/banner"
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
            title={!isExpanded ? "Banners" : ""}
          >
            <Image size={20} className="flex-shrink-0" />
            {isExpanded && <span>Banners</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Banners
              </div>
            )}
          </NavLink>
          )}

          {isVisible("announcements") && (
          <NavLink
            to="/admin/announcement"
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
            title={!isExpanded ? "Announcement" : ""}
          >
            <Megaphone size={20} className="flex-shrink-0" />
            {isExpanded && <span>Announcement</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Announcement
              </div>
            )}
          </NavLink>
          )}

          {isVisible("faqs") && (
          <NavLink
            to="/admin/faqs"
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
            title={!isExpanded ? "FAQs" : ""}
          >
            <HelpCircle size={20} className="flex-shrink-0" />
            {isExpanded && <span>FAQs</span>}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                FAQs
              </div>
            )}
          </NavLink>
          )}
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
