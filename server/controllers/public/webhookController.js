const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Payment = require("../../model/paymentModel");
const PendingOrder = require("../../model/pendingOrderModel");
const { createOrder } = require("../user/orderController");
const { createGuestOrder } = require("./guestOrderController");

const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Fallback if secret is not set, though it should be in production
    if (!secret) {
        console.warn("RAZORPAY_WEBHOOK_SECRET is not defined.");
        return res.status(200).send("Secret not defined");
    }

    const signature = req.headers["x-razorpay-signature"];

    // Verify signature using the rawBody captured in app.js
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    // We only care about successful payments
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpay_order_id = paymentEntity.order_id;
      const razorpay_payment_id = paymentEntity.id;

      // Check if payment is already recorded (frontend succeeded before webhook)
      const existingPayment = await Payment.findOne({ razorpay_order_id });
      if (existingPayment) {
        return res.status(200).send("Payment already processed");
      }

      // Find the pending order payload
      const pendingOrder = await PendingOrder.findOne({ razorpay_order_id });
      if (!pendingOrder) {
        return res.status(200).send("Pending order not found. Might be a payment from outside this checkout flow.");
      }

      // Mock Express Request object
      const mockReq = {
        body: pendingOrder.payload,
        cookies: {},
        user: pendingOrder.user, // for any middlewares that might read req.user
      };

      if (pendingOrder.user) {
        // Mock the JWT cookie so orderController can authenticate
        const token = jwt.sign({ _id: pendingOrder.user }, process.env.SECRET);
        mockReq.cookies.user_token = token;
      }

      let responseData = null;
      let responseError = null;

      // Mock Express Response object
      const mockRes = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          if (this.statusCode === 200 || this.statusCode === 201) {
            responseData = data;
          } else {
            responseError = data;
          }
        },
      };

      // Execute the actual order creation logic seamlessly
      if (pendingOrder.isGuest) {
        await createGuestOrder(mockReq, mockRes);
      } else {
        await createOrder(mockReq, mockRes);
      }

      if (responseError) {
        console.error("Webhook Order Creation failed:", responseError);
        return res.status(500).send("Order creation failed");
      }

      // Record the successful payment
      const orderId = responseData.order._id;
      await Payment.create({
        order: orderId,
        razorpay_order_id,
        payment_id: razorpay_payment_id,
        status: "success",
        paymentMode: "razorPay",
        user: pendingOrder.user,
      });

      console.log(`Webhook successfully processed order: ${orderId}`);
      return res.status(200).send("Webhook processed successfully");
    }

    res.status(200).send("Event ignored");
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    res.status(500).send("Webhook error");
  }
};

module.exports = { razorpayWebhook };
