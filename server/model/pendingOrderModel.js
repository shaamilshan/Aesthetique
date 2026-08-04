const mongoose = require("mongoose");
const { Schema } = mongoose;

const PendingOrderSchema = new Schema(
  {
    razorpay_order_id: { type: String, required: true, unique: true },
    isGuest: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" }, // If logged in
    payload: { type: Schema.Types.Mixed }, // Stores address, items, notes, guestEmail, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingOrder", PendingOrderSchema);
