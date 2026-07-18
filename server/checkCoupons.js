require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./model/couponModel');
const Product = require('./model/productModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const coupons = await Coupon.find({});
    console.log(`Found ${coupons.length} coupons:`);
    for (const c of coupons) {
      console.log(`- Code: ${c.code}, Type: ${c.type}, Value: ${c.value}, Applicable Products:`, c.applicableProducts);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
