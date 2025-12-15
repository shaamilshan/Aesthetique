const FAQ = require('../../model/faqModel');

const getPublicFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({ success: true, faqs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getPublicFaqs };
