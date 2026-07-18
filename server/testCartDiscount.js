require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./model/couponModel');
const Cart = require('./model/cartModel');
const Product = require('./model/productModel');

const mockGetUpdatedCartHelper = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate("items.product", {
      name: 1,
      imageURL: 1,
      price: 1,
      markup: 1,
    });

  if (cart && cart.coupon) {
    const Coupon = require("./model/couponModel");
    const appliedCoupon = await Coupon.findById(cart.coupon);

    let isValid = true;
    let reason = "";

    if (!appliedCoupon || !appliedCoupon.isActive) {
      isValid = false;
      reason = "Coupon not found or inactive";
    } else {
      const currentDate = new Date();
      if (appliedCoupon.expirationDate && new Date(appliedCoupon.expirationDate) <= currentDate) {
        isValid = false;
        reason = "Coupon expired";
      }
    }

    if (isValid) {
      const hasApplicableProducts = appliedCoupon.applicableProducts && appliedCoupon.applicableProducts.length > 0;
      let applicableSum = 0;
      let hasMatchingProduct = false;

      if (cart.items && cart.items.length > 0) {
        cart.items.forEach(item => {
          if (item.product) {
            const isApplicable = !hasApplicableProducts || appliedCoupon.applicableProducts.some(
              (pId) => pId.toString() === item.product._id.toString()
            );
            if (isApplicable) {
              applicableSum += item.product.price * item.quantity;
              hasMatchingProduct = true;
            }
          }
        });
      }

      if (hasApplicableProducts && !hasMatchingProduct) {
        isValid = false;
        reason = "Cart does not contain any products applicable to this coupon";
      } else if (applicableSum < appliedCoupon.minimumPurchaseAmount) {
        isValid = false;
        reason = `Minimum purchase amount not reached`;
      } else {
        let targetType = appliedCoupon.type;
        let targetDiscount = appliedCoupon.value;

        if (hasApplicableProducts) {
          if (appliedCoupon.type === "percentage") {
            targetType = "fixed";
            targetDiscount = Math.round((applicableSum * appliedCoupon.value) / 100);
          } else {
            targetType = "fixed";
            targetDiscount = Math.min(appliedCoupon.value, applicableSum);
          }
        } else {
          if (appliedCoupon.type === "fixed") {
            targetDiscount = Math.min(appliedCoupon.value, applicableSum);
          }
        }

        if (cart.discount !== targetDiscount || cart.type !== targetType) {
          cart.discount = targetDiscount;
          cart.type = targetType;
          await cart.save();
        }
      }
    }
  }
  return cart;
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const coupon = await Coupon.findOne({ code: "FIRSTORDE50" });
    const productA = await Product.findOne({ name: "Hydrating Hyaluronic Serum" }); // Eligible (price: 1299)
    const productB = await Product.findOne({ name: "Elysian Eau de Parfum" }); // Non-eligible (price: 3499)

    const mockUserId = new mongoose.Types.ObjectId();
    
    let cart = await Cart.create({
      user: mockUserId,
      items: [
        { product: productA._id, quantity: 1 },
        { product: productB._id, quantity: 1 }
      ],
      coupon: coupon._id,
      couponCode: coupon.code,
      discount: 0,
      type: "percentage"
    });

    console.log("Created temporary cart. Running mockGetUpdatedCartHelper...");
    
    const updatedCart = await mockGetUpdatedCartHelper(mockUserId);
    
    console.log("Recalculated Cart:");
    console.log("- Coupon Code:", updatedCart.couponCode);
    console.log("- Stored Discount Type:", updatedCart.type);
    console.log("- Stored Discount Value:", updatedCart.discount);
    
    const totalPrice = updatedCart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    console.log("- Total Price of Cart Items (₹1299 + ₹3499):", totalPrice);
    
    let offer = 0;
    if (updatedCart.type === "percentage") {
      offer = (totalPrice * updatedCart.discount) / 100;
    } else {
      offer = updatedCart.discount;
    }
    console.log("- Calculated Final Discount Offer:", offer);

    await Cart.deleteOne({ _id: cart._id });
    console.log("Temporary cart cleaned up.");

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
