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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);