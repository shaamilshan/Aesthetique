require('dotenv').config();
const mongoose = require('mongoose');
const Payment = require('../model/paymentModel');
const Order = require('../model/orderModel');
const uuid = require('uuid');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const allOrders = await Order.find({}).select('_id orderId paymentMode user');
  let fixed = 0;

  for (const order of allOrders) {
    const existing = await Payment.findOne({ order: order._id });
    if (!existing) {
      const pm = order.paymentMode || 'cashOnDelivery';
      await Payment.create({
        order: order._id,
        payment_id: pm === 'razorPay' ? 'razorpay_backfill_' + uuid.v4() : 'cod_' + uuid.v4(),
        ...(order.user ? { user: order.user } : {}),
        status: 'success',
        paymentMode: pm,
      });
      console.log('Created payment for order', order.orderId, '(' + pm + ')');
      fixed++;
    }
  }

  console.log('Total orders fixed:', fixed);
  await mongoose.disconnect();
  process.exit(0);
})();
