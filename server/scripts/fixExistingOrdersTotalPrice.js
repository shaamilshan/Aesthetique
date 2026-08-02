require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Order = require("../model/orderModel");

async function fixOrders() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not defined in environment.");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const orders = await Order.find({ discount: { $gt: 0 } });
    console.log(`Found ${orders.length} orders with discount > 0.`);

    let updatedCount = 0;
    for (const order of orders) {
      const correctTotal = Math.max(0, (order.subTotal || 0) - (order.discount || 0) + (order.shipping || 0));
      if (Math.abs(order.totalPrice - correctTotal) > 0.01) {
        console.log(`Fixing Order #${order.orderId || order._id}: current totalPrice=${order.totalPrice}, correctTotal=${correctTotal}`);
        order.totalPrice = correctTotal;
        await order.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} orders in MongoDB.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error fixing orders:", err);
    process.exit(1);
  }
}

fixOrders();
