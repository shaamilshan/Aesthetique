const Announcement = require('../../model/announcementModel');

// Get all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('getAllAnnouncements error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({ success: true, data: announcement });
  } catch (err) {
    console.error('getAnnouncementById error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, status, priority, startDate, endDate, isMarquee } = req.body;
    
    const newAnnouncement = new Announcement({
      title,
      content,
      status: status || 'active',
      priority: priority || 'medium',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
    isMarquee: isMarquee !== undefined ? isMarquee : true
    });

    const savedAnnouncement = await newAnnouncement.save();
    
    return res.status(201).json({ success: true, data: savedAnnouncement });
  } catch (err) {
    console.error('createAnnouncement error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update announcement by ID
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, priority, startDate, endDate, isMarquee } = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : new Date() }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : undefined }),
        ...(isMarquee !== undefined && { isMarquee })
      },
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({ success: true, data: updatedAnnouncement });
  } catch (err) {
    console.error('updateAnnouncement error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete announcement by ID
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('deleteAnnouncement error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get active announcements for public display
const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const activeAnnouncements = await Announcement.find({
      status: 'active',
      startDate: { $lte: now },
      $or: [
        { endDate: { $gte: now } },
        { endDate: null },
        { endDate: undefined }
      ]
    }).sort({ priority: 1, createdAt: -1 }); // 'high' priority comes first

    // If isMarquee is true, return only marquee announcements
    const marqueeAnnouncements = activeAnnouncements.filter(ann => ann.isMarquee);
    
    return res.status(200).json({ 
      success: true, 
      data: {
        all: activeAnnouncements,
        marquee: marqueeAnnouncements
      } 
    });
  } catch (err) {
    console.error('getActiveAnnouncements error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get marquee announcements for backward compatibility
const getMarqueeAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const marqueeAnnouncements = await Announcement.find({
      status: 'active',
      isMarquee: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $gte: now } },
        { endDate: null },
        { endDate: undefined }
      ]
    }).sort({ priority: 1, createdAt: -1 });

    // Extract just the content for marquee display
    const marqueeContent = marqueeAnnouncements.map(ann => ann.content);
    
    return res.status(200).json(marqueeContent);
  } catch (err) {
    console.error('getMarqueeAnnouncements error', err);
    return res.status(500).json(null);
  }
};

// Update marquee announcements (for backward compatibility)
const updateMarqueeAnnouncements = async (req, res) => {
  try {
    const { value } = req.body;
    
    // For backward compatibility, we'll update existing marquee announcements or create new ones
    // First, delete all existing marquee announcements
    await Announcement.deleteMany({ isMarquee: true });
    
    // Then create new ones based on the value
    if (Array.isArray(value)) {
      for (const content of value) {
        if (content && content.trim()) {
          await Announcement.create({
            title: `Marquee: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
            content: content,
            status: 'active',
            priority: 'medium',
            isMarquee: true
          });
        }
      }
    } else if (typeof value === 'string' && value.trim()) {
      await Announcement.create({
        title: `Marquee: ${value.substring(0, 30)}${value.length > 30 ? '...' : ''}`,
        content: value,
        status: 'active',
        priority: 'medium',
        isMarquee: true
      });
    }
    
    // Return the updated marquee announcements
    const updatedMarquee = await Announcement.find({ isMarquee: true });
    
    return res.status(200).json({ value: updatedMarquee });
  } catch (err) {
    console.error('updateMarqueeAnnouncements error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  getMarqueeAnnouncements,
  updateMarqueeAnnouncements
};