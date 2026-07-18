const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");
const Coupon = require("./couponModel");

const { Schema } = mongoose;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: Product,
      },
      quantity: {
        type: Number,
      },
      attributes: {
        type: Map,
        of: String,
      },
      discount: {
        type: Number,
        default: 0,
      },
      appliedCouponCode: {
        type: String,
        default: null,
      },
    },
  ],
  appliedCoupons: [
    {
      coupon: {
        type: Schema.Types.ObjectId,
        ref: Coupon,
      },
      code: {
        type: String,
      },
      discount: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
  ],
  discount: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
