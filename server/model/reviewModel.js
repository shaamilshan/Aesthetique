const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "User reference is required"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: Product,
      required: [true, "Product reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    body: {
      type: String,
      required: [true, "Review body is required"],
      trim: true,
      maxlength: [1000, "Review body cannot exceed 1000 characters"],
    },
    // New field to track review updates
    isUpdated: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true
  }
);

module.exports = mongoose.model("Review", reviewSchema);