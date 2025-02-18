import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

// Redux
import { getUserDataFirst } from "./redux/actions/userActions";

// General
// import Home from "./page/public/Home";
// import Contact from "./page/public/Contact";
// import About from "./page/public/About";
// import Error404 from "./page/public/Error404";

// Components
import Navbar from "./components/Navbar";
// import CategorySection from "./components/CategoryBar";
import Footer from "./components/Footer";

// Auth
import Login from "./page/auth/Login";
import Register from "./page/auth/Register";
import ValidateOTP from "./page/auth/ValidateOTP";
import ForgetPassword from "./page/auth/ForgetPassword";

// User
import Dashboard from "./page/Dashboard";
import ProductDetails from "./page/user/ProductDetails";
import Cart from "./page/user/Cart";
import Checkout from "./page/user/Checkout";
import OrderHistory from "./page/user/OrderHistory";
import ProfilePage from "./page/user/ProfilePage";
import OrderDetail from "./page/user/OrderDetails/OrderDetail";
import ProfileDashboard from "./page/user/profileDashboard";
import Dash from "./page/user/profileDashboard/pages/Dash";
import Wallet from "./page/user/profileDashboard/pages/wallet";
import Addresses from "./page/user/profileDashboard/pages/addresses";
import TrackOrder from "./page/user/profileDashboard/pages/trackOrder";
import WishList from "./page/user/profileDashboard/pages/wishlist";
import BuyNow from "./page/user/buyNow";

// Admin
import AdminDash from "./page/admin/Dashboard";
import ManagerDash from "./page/manager/Dashboard";
import AdminHome from "./page/admin/pages/AdminHome";
import Banner from "./page/admin/pages/banner/Banner";
import Payments from "./page/admin/pages/payments/Payments";
import Settings from "./page/admin/pages/Settings";
import Help from "./page/admin/pages/Help";

import ManageAdmins from "./page/admin/pages/admins/ManageAdmins";
import Customers from "./page/admin/pages/customer/Customers";
import CreateAdmin from "./page/admin/pages/admins/CreateAdmin";

import Products from "./page/admin/pages/products/Products";
import AddProducts from "./page/admin/pages/products/AddProducts";
import EditProduct from "./page/admin/pages/products/EditProduct";

import Categories from "./page/admin/pages/categories/Categories";
import CreateCategory from "./page/admin/pages/categories/CreateCategory";
import EditCategory from "./page/admin/pages/categories/EditCategory";

import Orders from "./page/admin/pages/Order/Orders";
import OrderDetails from "./page/admin/pages/Order/OrderDetails";
import ReturnRequests from "./page/admin/pages/Order/ReturnRequests";

import Coupon from "./page/admin/pages/coupon/Coupon";
import CreateCoupon from "./page/admin/pages/coupon/CreateCoupon";
import EditCoupon from "./page/admin/pages/coupon/EditCoupon";
import FindCoupons from "./page/user/profileDashboard/pages/findCoupons";
import OrderConfirmation from "./page/user/components/OrderConfirmation";
import SettingsPage from "./page/user/profileDashboard/pages/settings";
import About from "./page/user/others/About";
import Home from "./page/user/others/Home";
import Collectionsold from "./page/user/others/Collectionsold";
import Collections from "./page/user/others/Collection";
import Contact from "./page/user/others/Contact";
import SingleProduct from "./page/user/others/SingleProduct";
import SingleProduct2 from "./page/user/others/SingleProduct2";
import LoginDemo from "./page/user/others/LoginDemo";
import Home2 from "./page/user/others/Home2";
import ManagerSignup from "./page/manager/ManagerSignup";
import ManagerHome from "./page/manager/pages/ManagerHome";
import Enquiries from "./page/admin/pages/products/Enquiries";
import EditStock from "./page/admin/pages/products/EditStock";
import ManagerOrders from "./page/admin/pages/Order/ManagerOrders";
import Managers from "./page/admin/pages/managers/Managers";
import AllManagerOrders from "./page/admin/pages/Order/AllManagerOrders";
import OldRegister from "./page/auth/OldRegister";
import ProductPageDesign from "./page/ProductPageDesign";

function App() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getUserDataFirst());
    }
    console.log(user);
  }, [dispatch, user]);

  const ProtectedRoute = ({ element }) => {
    const { user } = useSelector((state) => state.user);

    return user ? element : <Navigate to="/login" />;
  };

  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        {user ? user.role === "user" && <Navbar usercheck={true} /> : <Navbar usercheck={false} />}
        {/* {user ? user.role === "user" && <CategorySection /> : <CategorySection />} */}

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === "superAdmin" ? (
                  <Navigate to="/admin/" />
                ) : user.role === "manager" ? (
                  <Navigate to="/manager/" />
                ) : (
                  // <Home />
                  <Home2 />
                  // <Dashboard />
                )
              ) : (
                // <Home />
                <Home2 />
                // <Home />
              )
            }
          />

          <Route path="/manager-signup" element={<ManagerSignup />} />
          <Route path="/design-demo" element={<ProductPageDesign />} />
          <Route path="/login-demo" element={<LoginDemo />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/collection" element={<Collectionsold />} />
          <Route path="/collections" element={<Collections />} />
          {/* <Route path="/productnew" element={<SingleProduct2 />} /> */}
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/home" element={<Dashboard />} />

          {/* Auth Pages */}

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="old-register" element={<OldRegister />} />
          <Route path="otp" element={<ValidateOTP />} />
          <Route path="forgot-password" element={<ForgetPassword />} />
          {/* <Route path="/admin/managers/:id" element={<AllManagerOrders />} /> */}

          {/* General Pages */}
          {/* <Route path="contact" element={<Contact />} /> */}
          {/* <Route path="about" element={<About />} /> */}

          {/* User Routes */}
          <Route path="/product/:id" element={<SingleProduct />} />
          {/* <Route path="/product/:id" element={<ProductDetails/>} /> */}

          {/* <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} /> */}
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={<ProtectedRoute element={<Checkout />} />}
          />

          <Route
            path="/order-confirmation"
            element={<ProtectedRoute element={<OrderConfirmation />} />}
          />

          <Route
            path="/buy-now"
            element={<ProtectedRoute element={<BuyNow />} />}
          />

          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<ProfileDashboard />} />}
          >
            <Route index element={<Dash />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="order-history/detail/:id" element={<OrderDetail />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="wishlist" element={<WishList />} />
            {/* <Route path="find-coupons" element={<FindCoupons />} /> */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
          </Route>

          {/* Admin Routes
          {(user && user.role === "admin") ||
          (user && user.role === "superAdmin") ? (
            <Route path="/admin/*" element={<AdminRoutes />} />
          ) : (
            -(<Route path="/admin" element={<Navigate to="/" />} />)
          )} */}

          {/* Admin Routes */}
          {user ? (
            user.role === "admin" || user.role === "superAdmin" ? (
              <Route path="/admin/*" element={<AdminRoutes />} />
            ) : user.role === "manager" ? (
              <Route path="/manager/*" element={<ManagerRoutes />} />
            ) : (
              <Route path="/admin" element={<Navigate to="/" />} />
            )
          ) : (
            <Route path="/admin" element={<Navigate to="/" />} />
          )}

          {/* <Route path="*" element={<Error404 />} /> */}
        </Routes>
        {user ? user.role === "user" && <Footer /> : <Footer />}
      </BrowserRouter>
    </>
  );
}

export default App;

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDash />}>
        <Route index element={<AdminHome />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProducts />} />
        <Route path="products/edit/:id" element={<EditProduct />} />

        <Route path="categories" element={<Categories />} />
        <Route path="categories/create" element={<CreateCategory />} />
        <Route path="categories/edit/:id" element={<EditCategory />} />

        <Route path="orders" element={<Orders />} />
        <Route path="orders/detail/:id" element={<OrderDetails />} />
        <Route path="orders/return-requests" element={<ReturnRequests />} />
        <Route
          path="orders/return-requests/detail/:id"
          element={<OrderDetails />}
        />

        <Route path="manageAdmins" element={<ManageAdmins />} />
        <Route path="manageAdmins/create" element={<CreateAdmin />} />

        <Route path="coupon" element={<Coupon />} />
        <Route path="coupon/create" element={<CreateCoupon />} />
        <Route path="coupon/edit/:id" element={<EditCoupon />} />

        <Route path="banner" element={<Banner />} />
        <Route path="payments" element={<Payments />} />
        <Route path="customers" element={<Customers />} />

        <Route path="managers" element={<Managers />} />
        <Route path="managers/:id" element={<AllManagerOrders />} />

        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        {/* <Route path="*" element={<Error404 />} /> */}
      </Route>
    </Routes>
  );
}

function ManagerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ManagerDash />}>
        <Route index element={<ManagerHome />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="enquiries/edit/:id/:name/:value" element={<EditStock />} />
        <Route path="help" element={<Help />} />
        <Route path="orders" element={<ManagerOrders />} />
        <Route path="orders/detail/:id" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
}
