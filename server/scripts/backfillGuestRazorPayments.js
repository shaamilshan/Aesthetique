/**
 * Backfill missing Razorpay Payment records for guest orders in production.
 *
 * Usage:
 *   MONGO_URI="mongodb+srv://..." node scripts/backfillGuestRazorPayments.js
 *
 * Or if your prod URI is in a .env.production file:
 *   cp .env.production .env && node scripts/backfillGuestRazorPayments.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Payment = require('../model/paymentModel');
const Order = require('../model/orderModel');
const uuid = require('uuid');

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGO_URI not set. Pass it as an env var:');
    console.error('  MONGO_URI="mongodb+srv://..." node scripts/backfillGuestRazorPayments.js');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to database');

  // Find all Razorpay orders (both guest and user) that are missing a Payment record
  const allRazorOrders = await Order.find({ paymentMode: 'razorPay' }).select('_id orderId paymentMode user guestEmail');

  let fixed = 0;
  let alreadyExist = 0;

  for (const order of allRazorOrders) {
    const existing = await Payment.findOne({ order: order._id });
    if (existing) {
      alreadyExist++;
      continue;
    }

    const isGuest = !order.user;
    await Payment.create({
      order: order._id,
      payment_id: `razorpay_backfill_${uuid.v4()}`,
      ...(order.user ? { user: order.user } : {}),
      status: 'success',
      paymentMode: 'razorPay',
    });

    console.log(`  Created payment for Order #${order.orderId} (${isGuest ? 'GUEST' : 'USER'})`);
    fixed++;
  }

  console.log(`\nDone. Backfilled: ${fixed} | Already had payment: ${alreadyExist} | Total Razorpay orders: ${allRazorOrders.length}`);

  await mongoose.disconnect();
  process.exit(0);
})();
