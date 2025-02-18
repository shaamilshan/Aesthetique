const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquirySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products", // Referencing the Products model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    stockQuantity: {
      type: Number,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Referencing the Category model
    },
    imageURL: {
      type: String,
    },
    price: {
      type: Number,
    },
    markup: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "out of stock",
        "low quantity",
        "unpublished",
      ],
    },
    attributes: [
      {
        name: {
          type: String,
        },
        value: {
          type: String,
        },
        isHighlight: {
          type: Boolean,
        },
        imageIndex: {
          type: Number,
        },
      },
    ],
    moreImageURL: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
    },
    rating: {
      type: Number,
    },
    numberOfReviews: {
      type: Number,
    },
    offer: {
      type: Number,
    },
    enquiryDate: {
      type: Date,
      default: Date.now, // Automatically sets the enquiry date
    },
    enquiryStatus: {
      type: String,
      enum: ["pending", "in progress", "completed"], // Status of the enquiry
      default: "pending",
    },
    customerDetails: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    enqattname:{
      type: String,
    },
    enqattvalue:{
      type: String,
    }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;
