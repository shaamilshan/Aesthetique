const express = require("express");
const { getBanners, getActiveHomeBanner, getAllHomeBanners } = require("../controllers/global/bannerController");
const { getPublicFaqs } = require("../controllers/global/faqController");
const { getPublicSetting } = require("../controllers/global/settingController");
const { getCategories } = require("../controllers/global/collectionController");
const { getIphone } = require("../controllers/global/iPhoneController");
const { getActiveAnnouncements, getMarqueeAnnouncements } = require("../controllers/admin/announcementController");
const { createGuestOrder, guestVerifyPayment } = require("../controllers/public/guestOrderController");
const { createRazerPayOrder, getKey } = require("../controllers/user/paymentController");
const { razorpayWebhook } = require("../controllers/public/webhookController");
const { getPublicOrder } = require("../controllers/public/orderController");

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

// Order tracking
router.get('/order/:id', getPublicOrder);

// Razorpay (available to guests too)
router.post('/razor-order', createRazerPayOrder);
router.get('/razor-key', getKey);

// Razorpay Webhook
router.post('/webhook/razorpay', razorpayWebhook);

// Open Graph Share Proxy for SPAs
router.get('/share/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const Product = require("../model/productModel");
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const host = req.get("host");
    const protocol = req.protocol;
    
    // Resolve absolute image URL
    let imageUrl = product.imageURL;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${protocol}://${host}/api/img/${imageUrl}`;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const productUrl = `${clientUrl}/product/${id}`;

    res.setHeader("Content-Type", "text/html");
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${product.name} | BM Aesthetique">
  <meta property="og:description" content="${product.description ? product.description.replace(/["\n\r]/g, ' ').slice(0, 150) : "Premium aesthetic product"}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${productUrl}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${product.name} | BM Aesthetique">
  <meta name="twitter:description" content="${product.description ? product.description.replace(/["\n\r]/g, ' ').slice(0, 150) : "Premium aesthetic product"}">
  <meta name="twitter:image" content="${imageUrl}">

  <title>${product.name} | BM Aesthetique</title>
  
  <script>
    // Redirect browser to actual frontend product page
    window.location.href = "${productUrl}";
  </script>
</head>
<body>
  <p>Redirecting to <a href="${productUrl}">${product.name}</a>...</p>
</body>
</html>
    `);
  } catch (error) {
    console.error("Error generating share preview:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
