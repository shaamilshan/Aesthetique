const express = require("express");
const { getBanners, getActiveHomeBanner, getAllHomeBanners } = require("../controllers/global/bannerController");
const { getPublicFaqs } = require("../controllers/global/faqController");
const { getPublicSetting } = require("../controllers/global/settingController");
const { getCategories } = require("../controllers/global/collectionController");
const { getIphone } = require("../controllers/global/iPhoneController");

const router = express.Router();

router.get("/banners", getBanners);
router.get("/home-banner", getActiveHomeBanner);
router.get("/home-banners", getAllHomeBanners);

router.get("/collections", getCategories);

router.get("/new-iphone", getIphone);

router.get('/faqs', getPublicFaqs);

// Public site settings
router.get('/setting/:key', getPublicSetting);

module.exports = router;
