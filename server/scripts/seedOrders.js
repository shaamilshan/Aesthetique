require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const Coupon = require('../model/couponModel');
const Order = require('../model/orderModel');

(async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    // 1. Find the test/admin user
    const user = await User.findOne({ email: "admin@aesthetique.com" });
    if (!user) {
      console.log("Admin user not found. Please run seedData.js first.");
      process.exit(1);
    }
    console.log(`Found user: ${user.firstName} ${user.lastName} (${user._id})`);

    // 2. Find or create the coupon FIRSTORDE50
    let coupon = await Coupon.findOne({ code: "FIRSTORDE50" });
    if (!coupon) {
      console.log("Coupon FIRSTORDE50 not found. Creating it...");
      coupon = await Coupon.create({
        code: "FIRSTORDE50",
        type: "percentage",
        value: 10,
        isActive: true,
        isFirstOrder: false,
        minimumPurchaseAmount: 500,
        description: "10% off on specific products",
      });
    }
    console.log(`Using coupon: ${coupon.code} (${coupon._id})`);

    // 3. Find some products
    const productsList = await Product.find({}).limit(5);
    if (productsList.length < 2) {
      console.log("Not enough products found. Please seed products first using seedData.js.");
      process.exit(1);
    }

    const prod1 = productsList[0]; // Hydrating Hyaluronic Serum (or similar)
    const prod2 = productsList[1]; // Another product

    console.log(`Product 1 (Eligible): ${prod1.name} - ₹${prod1.price}`);
    console.log(`Product 2 (Not Eligible): ${prod2.name} - ₹${prod2.price}`);

    // Set coupon applicable products to only include Product 1
    coupon.applicableProducts = [prod1._id];
    await coupon.save();

    // 4. Calculate pricing and discounts
    const qty1 = 1;
    const qty2 = 1;

    const discount1 = Math.round((prod1.price * qty1 * coupon.value) / 100);
    const discount2 = 0; // Product 2 not eligible

    const subTotal = (prod1.price * qty1) + (prod2.price * qty2);
    const totalDiscount = discount1 + discount2;
    const totalPrice = subTotal - totalDiscount;

    console.log(`Subtotal: ₹${subTotal}`);
    console.log(`Total Discount: ₹${totalDiscount}`);
    console.log(`Total Price: ₹${totalPrice}`);

    // 5. Create Order
    const orderData = {
      user: user._id,
      address: {
        firstName: user.firstName || "Admin",
        lastName: user.lastName || "User",
        companyName: "Aesthetique",
        address: "123 Elegance Boulevard",
        country: "India",
        regionState: "Karnataka",
        city: "Bengaluru",
        pinCode: 560001,
        email: user.email,
        phoneNumber: "9876543210",
      },
      products: [
        {
          productId: prod1._id,
          quantity: qty1,
          totalPrice: prod1.price * qty1,
          price: prod1.price,
          markup: prod1.markup || 0,
          discount: discount1,
          appliedCouponCode: coupon.code,
        },
        {
          productId: prod2._id,
          quantity: qty2,
          totalPrice: prod2.price * qty2,
          price: prod2.price,
          markup: prod2.markup || 0,
          discount: discount2,
          appliedCouponCode: null,
        }
      ],
      subTotal: subTotal,
      shipping: 0,
      tax: 0,
      totalPrice: totalPrice,
      paymentMode: "cashOnDelivery",
      totalQuantity: qty1 + qty2,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          description: "Order seeded for testing multiple coupon breakdown",
        }
      ],
      discount: totalDiscount,
      appliedCoupons: [
        {
          coupon: coupon._id,
          code: coupon.code,
          discount: totalDiscount,
          type: coupon.type,
          value: coupon.value
        }
      ],
      couponCode: coupon.code,
    };

    const newOrder = await Order.create(orderData);
    console.log(`\nSuccessfully seeded test order!`);
    console.log(`Order ID: ${newOrder.orderId}`);
    console.log(`Database Document ID: ${newOrder._id}`);

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    mongoose.disconnect();
    console.log("Database disconnected.");
  }
})();
