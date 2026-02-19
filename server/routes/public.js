const express = require("express");
const { getBanners, getActiveHomeBanner, getAllHomeBanners } = require("../controllers/global/bannerController");
const { getPublicFaqs } = require("../controllers/global/faqController");
const { getPublicSetting } = require("../controllers/global/settingController");
const { getCategories } = require("../controllers/global/collectionController");
const { getIphone } = require("../controllers/global/iPhoneController");
const { getActiveAnnouncements, getMarqueeAnnouncements } = require("../controllers/admin/announcementController");
const { createGuestOrder, guestVerifyPayment } = require("../controllers/public/guestOrderController");
const { createRazerPayOrder, getKey } = require("../controllers/user/paymentController");

const router = express.Router();

router.get("/banners", getBanners);
router.get("/home-banner", getActiveHomeBanner);
router.get("/home-banners", getAllHomeBanners);

router.get("/collections", getCategories);

router.get("/new-iphone", getIphone);

router.get('/faqs', getPublicFaqs);

// Public site settings
router.get('/setting/:key', getPublicSetting);

// Public announcements
router.get('/announcements', getActiveAnnouncements);
router.get('/setting/marquee', getMarqueeAnnouncements);

// Guest checkout
router.post('/guest-order', createGuestOrder);
router.post('/guest-razor-verify', guestVerifyPayment);

// Razorpay (available to guests too)
router.post('/razor-order', createRazerPayOrder);
router.get('/razor-key', getKey);

module.exports = router;
