const mongoose = require("mongoose");

const { Schema } = mongoose;

const BannerSchema = new Schema({
  images: [String], // Keep for backward compatibility
  homeBanners: {
    banner1: {
      image: String,
      title: String,
      subtitle: String,
      isActive: { type: Boolean, default: true }
    },
    banner2: {
      image: String,
      title: String,
      subtitle: String,
      isActive: { type: Boolean, default: false }
    },
    banner3: {
      image: String,
      title: String,
      subtitle: String,
      isActive: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
