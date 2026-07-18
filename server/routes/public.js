const express = require("express");
const { getBanners, getActiveHomeBanner, getAllHomeBanners } = require("../controllers/global/bannerController");
const Product = require("../model/productModel");

// Simple in-memory cache for Open Graph metadata
const ogCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

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
    
    // Check in-memory cache first
    const cached = ogCache.get(id);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      res.setHeader("Content-Type", "text/html");
      return res.send(cached.html);
    }

    const product = await Product.findById(id).select("name description imageURL").lean();
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

    // Determine image mime type
    let imageType = "image/jpeg";
    if (imageUrl.toLowerCase().endsWith(".png")) {
      imageType = "image/png";
    } else if (imageUrl.toLowerCase().endsWith(".webp")) {
      imageType = "image/webp";
    } else if (imageUrl.toLowerCase().endsWith(".gif")) {
      imageType = "image/gif";
    }
    const secureImageUrl = imageUrl.startsWith("http://") ? imageUrl.replace("http://", "https://") : imageUrl;

    const clientUrl = req.query.frontend || process.env.CLIENT_URL || "http://localhost:5173";
    const productUrl = `${clientUrl}/product/${id}`;

    const html = `
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
  <meta property="og:image:secure_url" content="${secureImageUrl}">
  <meta property="og:image:type" content="${imageType}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
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
    `;

    // Cache the generated HTML
    ogCache.set(id, { html, timestamp: Date.now() });
    
    // Evict oldest entry if cache exceeds 1000 items
    if (ogCache.size > 1000) {
      const oldestKey = ogCache.keys().next().value;
      ogCache.delete(oldestKey);
    }

    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  } catch (error) {
    console.error("Error generating share preview:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
