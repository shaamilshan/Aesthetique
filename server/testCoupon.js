require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./model/couponModel');
const Cart = require('./model/cartModel');
const Product = require('./model/productModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const coupon = await Coupon.findOne({ code: "FIRSTORDE50" });
    const product = await Product.findOne({ name: "Elysian Eau de Parfum" });

    console.log("Coupon applicable products:", coupon.applicableProducts);
    console.log("Product ID:", product._id);

    // Mock cart items with only the non-eligible product
    const cartItems = [{ product: product, quantity: 1 }];

    const hasApplicableProducts = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    let applicableSum = 0;
    let hasMatchingProduct = false;

    cartItems.forEach((item) => {
      if (item.product) {
        const isApplicable = !hasApplicableProducts || coupon.applicableProducts.some(
          (pId) => pId.toString() === item.product._id.toString()
        );
        if (isApplicable) {
          applicableSum += item.product.price * item.quantity;
          hasMatchingProduct = true;
        }
      }
    });

    console.log("hasApplicableProducts:", hasApplicableProducts);
    console.log("hasMatchingProduct:", hasMatchingProduct);
    console.log("applicableSum:", applicableSum);

    if (hasApplicableProducts && !hasMatchingProduct) {
      console.log("RESULT: Correctly rejected! Coupon is not applicable to any products in your cart.");
    } else {
      console.log("RESULT: ERROR! Coupon was accepted for non-eligible products.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
