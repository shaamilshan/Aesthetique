const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    content: { 
      type: String, 
      required: true, 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
    priority: { 
      type: String, 
      enum: ['high', 'medium', 'low'], 
      default: 'medium' 
    },
    startDate: { 
      type: Date, 
      default: Date.now 
    },
    endDate: { 
      type: Date 
    },
    isMarquee: { 
      type: Boolean, 
      default: true 
    }
    ,
    // Styling/customization fields added so admin can control public marquee appearance
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    fontFamily: {
      type: String,
      default: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    },
    fontSize: {
      type: Number,
      default: 16
    },
    useGoogleFont: {
      type: Boolean,
      default: false
    },
    googleFontLink: {
      type: String,
      default: ''
    }
    ,
    // explicit font color for announcement text
    fontColor: {
      type: String,
      default: '#111827'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);