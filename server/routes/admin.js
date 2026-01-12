const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();
const requirePermission = require("../middleware/requirePermission");

const {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  updateProductManager,
} = require("../controllers/admin/productController");
const {
  getCustomers,
  getCustomer,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  blockOrUnBlockCustomer,
  getManagers,
} = require("../controllers/admin/customerController");
const {
  getCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/admin/categoryController");
const {
  getOrders,
  getOrder,
  getLatestOrders,
  clearOrder,
  updateOrderStatus,
  generateOrderInvoice,
} = require("../controllers/admin/orderController");
const {
  generateOrderExcel,
  generateOrderPDF,
  generateOrderCSV,
} = require("../controllers/admin/orderExportController");
const {
  getReturnCount,
  getReturnOrders,
  getReturnOrder,
  updateReturnOrderStatus,
} = require("../controllers/admin/returnController");
const {
  getPayments,
  clearPayments,
} = require("../controllers/admin/paymentController");
const { clearWallet } = require("../controllers/admin/walletController");
const {
  getCoupons,
  getCoupon,
  addCoupon,
  editCoupon,
  deleteCoupon,
} = require("../controllers/admin/couponController");
const { generateExcel } = require("../controllers/admin/reportController");
const {
  readRevenueData,
  readUserCount,
  readSalesData,
  readProfitData,
  readMostSoldProducts,
} = require("../controllers/admin/dashController");
const {
  addBanners,
  readBanners,
  deleteBanner,
  updateBannerOrder,
  updateHomeBanner,
  getHomeBanners,
  setActiveHomeBanner,
  deleteHomeBanner,
} = require("../controllers/admin/bannerController");
const { getFaqs, getFaq, addFaq, updateFaq, deleteFaq } = require("../controllers/admin/faqController");
const { getSetting, upsertSetting } = require("../controllers/admin/settingController");
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getMarqueeAnnouncements,
  updateMarqueeAnnouncements
} = require("../controllers/admin/announcementController");

// Products controller functions mounting them to corresponding route
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
// Protect product modification routes with granular permissions
router.delete("/product/:id", requirePermission("products:delete"), deleteProduct);
router.patch("/product/:id", requirePermission("products:edit"), upload.any(), updateProduct);
router.patch("/product/manager/:id", requirePermission("products:edit"), upload.any(), updateProductManager);
router.post("/product", requirePermission("products:add"), upload.any(), addProduct);

// Customer controller functions mounting them to corresponding route
router.get("/customers", getCustomers);
router.get("/managers", getManagers);
router.get("/customer/:id", getCustomer);
router.delete("/customer/:id", requirePermission("users:delete"), deleteCustomer);
router.patch("/customer/:id", requirePermission("users:edit"), updateCustomer);
router.post("/customer", requirePermission("users:add"), upload.any(), addCustomer);
router.patch("/customer-block-unblock/:id", requirePermission("users:edit"), blockOrUnBlockCustomer);

// Category controller functions mounting them to corresponding route
router.get("/categories", getCategories);
router.get("/category/:id", getCategory);
router.delete("/category/:id", requirePermission("categories:delete"), deleteCategory);
router.patch("/category/:id", requirePermission("categories:edit"), upload.single("imgURL"), updateCategory);
router.post("/category", requirePermission("categories:add"), (req, res, next) => {
  upload.single("imgURL")(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, createCategory);

// Order controller functions mounting them to corresponding route
router.get("/orders", getOrders);
router.get("/latest-orders", getLatestOrders);
router.delete("/clear-orders", clearOrder);
router.get("/order/:id", getOrder);
router.patch("/order-status/:id", updateOrderStatus);
router.get("/order-generate-excel", generateOrderExcel); // Generating Excel
router.get("/order-generate-pdf", generateOrderPDF); // Generating PDF
router.get("/order-generate-csv", generateOrderCSV); // Generating PDF
router.get("/order-invoice/:id", generateOrderInvoice);

// Return Order controller functions mounting them to corresponding route
router.get("/return-orders-count", getReturnCount);
router.get("/return-orders", getReturnOrders);
router.get("/return-order/:id", getReturnOrder);
router.patch("/return-order-status/:id", updateReturnOrderStatus);

// Payment controller function importing mounting
router.get("/payments", getPayments);
router.get("/clear-payments", clearPayments);

// Clear Wallet for testing purpose
router.get("/clear-wallet", clearWallet);

// Coupon Controller functions mounting
router.get("/coupons", getCoupons);
router.get("/coupon/:id", getCoupon);
router.delete("/coupon/:id", requirePermission("coupons:delete"), deleteCoupon);
router.patch("/coupon/:id", requirePermission("coupons:edit"), editCoupon);
router.post("/coupon", requirePermission("coupons:add"), addCoupon);

// Generate Orders Excel
router.get("/generateReport", generateExcel);

// Admin Dashboard data | Chart data
router.get("/revenue-report", readRevenueData);
router.get("/sales-report", readSalesData);
router.get("/profit-report", readProfitData);
router.get("/user-count", readUserCount);
router.get("/most-sold-product", readMostSoldProducts);

// Banner Controllers
router.post("/banners", requirePermission("banners:edit"), upload.any(), addBanners);
router.get("/banners", requirePermission("banners:view"), readBanners);
router.patch("/banners/", requirePermission("banners:edit"), updateBannerOrder);
router.delete("/banner/:id", requirePermission("banners:delete"), deleteBanner);

// Home Banner Controllers
router.get("/home-banners", getHomeBanners);
router.put("/home-banners/:bannerNumber", upload.any(), updateHomeBanner);
router.patch("/home-banners/:bannerNumber/activate", setActiveHomeBanner);
router.delete("/home-banners/:bannerNumber", deleteHomeBanner);

// FAQ Controllers
router.get('/faqs', getFaqs);
router.get('/faq/:id', getFaq);
router.post('/faq', addFaq);
router.patch('/faq/:id', updateFaq);
router.delete('/faq/:id', deleteFaq);

// Marquee compatibility routes (for backward compatibility)
// These must be registered before the generic `/setting/:key` routes so
// requests to `/setting/marquee` are handled by the marquee handlers.
router.get('/setting/marquee', getMarqueeAnnouncements);
router.put('/setting/marquee', updateMarqueeAnnouncements);

// Site settings (keyed)
router.get('/setting/:key', getSetting);
router.put('/setting/:key', upsertSetting);

// Announcement Controllers
router.get('/announcements', getAllAnnouncements);
router.get('/announcements/:id', getAnnouncementById);
router.post('/announcements', createAnnouncement);
router.patch('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Marquee compatibility routes (for backward compatibility)
router.get('/setting/marquee', getMarqueeAnnouncements);
router.put('/setting/marquee', updateMarqueeAnnouncements);
module.exports = router;
