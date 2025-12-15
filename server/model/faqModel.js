const mongoose = require("mongoose");
const { Schema } = mongoose;

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema);
module.exports = FAQ;
