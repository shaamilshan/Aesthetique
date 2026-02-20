const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");
const Coupon = require("./couponModel");
const Counter = require("./counterModel");

const { Schema } = mongoose;

const AddressSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  regionState: {
    type: String,
  },
  city: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
});

const ProductSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  markup: {
    type: Number,
    required: true,
  },
  attributes: {
    type: Map,
    of: String,
  },
});

const StatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "canceled",
      "return request",
      "return approved",
      "return rejected",
      "pickup completed",
      "returned",
    ],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  trackingId: {
    type: String,
  },
  reason: {
    type: String,
  },
});

const OrderSchema = new Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    invoiceNumber: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      // Not required — guest orders won't have a user
    },
    guestEmail: {
      type: String,
    },
    guestPhone: {
      type: String,
    },
    trackingId: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "canceled",
        "return request",
        "return approved",
        "return rejected",
        "pickup completed",
        "returned",
      ],
      default: "pending",
    },
    statusHistory: [StatusHistorySchema],
    address: AddressSchema,
    deliveryDate: {
      type: Date,
      default: () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7); // For a week
        return currentDate;
      },
    },
    subTotal: {
      type: Number,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    products: [ProductSchema],
    paymentMode: {
      type: String,
      required: true,
      enum: ["cashOnDelivery", "razorPay", "myWallet"],
    },
    totalQuantity: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: Coupon,
    },
    couponCode: {
      type: String,
    },
    discount: {
      type: Number,
    },
    couponType: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Order ID generation + Invoice Number (B2C/XXX/YY-YY)
OrderSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    // ── orderId (numeric, sequential, never resets) ──
    const counter = await Counter.findOne({ model: "Order", field: "orderId" });

    if (counter) {
      this.orderId = counter.count + 1;
      counter.count += 1;
      await counter.save();
    } else {
      await Counter.create({ model: "Order", field: "orderId" });
      this.orderId = 1000;
    }

    // ── invoiceNumber — B2C/XXX/YY-YY (resets every April 1) ──
    const now = new Date();
    const month = now.getMonth(); // 0-indexed (0 = Jan, 3 = Apr)
    const year = now.getFullYear();
    // Financial year starts April 1
    // If month >= 3 (April+), FY = year – (year+1), e.g. 2025-26
    // If month < 3 (Jan-Mar), FY = (year-1) – year, e.g. 2025-26 for Jan 2026
    const fyStart = month >= 3 ? year : year - 1;
    const fyEnd = fyStart + 1;
    const fyLabel = `${String(fyStart).slice(-2)}-${String(fyEnd).slice(-2)}`; // e.g. "25-26"
    const counterKey = `Invoice_FY_${fyLabel}`; // unique per financial year

    let invCounter = await Counter.findOne({ model: counterKey, field: "invoiceSeq" });

    let seq;
    if (invCounter) {
      seq = invCounter.count + 1;
      invCounter.count = seq;
      await invCounter.save();
    } else {
      // First invoice of this financial year — start at 1
      seq = 1;
      await Counter.create({ model: counterKey, field: "invoiceSeq", count: 1 });
    }

    // Pad sequence to 3 digits (001, 002, … 999, 1000+)
    const seqStr = String(seq).padStart(3, "0");
    // FY 25-26 uses prefix "B2C", from FY 26-27 onwards use "BMC"
    const prefix = fyStart >= 2026 ? "BMC" : "B2C";
    this.invoiceNumber = `${prefix}/${seqStr}/${fyLabel}`;

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Order", OrderSchema);
