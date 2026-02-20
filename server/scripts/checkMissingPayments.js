require('dotenv').config();
const mongoose = require('mongoose');
const Payment = require('../model/paymentModel');
const Order = require('../model/orderModel');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const allOrders = await Order.find({}).select('_id orderId paymentMode user guestEmail guestPhone').sort({ orderId: 1 });

  console.log('All orders:');
  for (const order of allOrders) {
    const payment = await Payment.findOne({ order: order._id });
    const isGuest = !order.user;
    console.log(
      `  Order #${order.orderId} | ${order.paymentMode} | ${isGuest ? 'GUEST' : 'USER'} | Payment: ${payment ? 'EXISTS (' + payment.payment_id + ')' : 'MISSING'}`
    );
  }

  await mongoose.disconnect();
  process.exit(0);
})();
