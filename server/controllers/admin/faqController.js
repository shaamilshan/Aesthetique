const FAQ = require('../../model/faqModel');

// Admin: get all faqs (with optional pagination/filter later)
const getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({ success: true, faqs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getFaq = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.status(200).json({ success: true, faq });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const addFaq = async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;
    const faq = await FAQ.create({ question, answer, order: order || 0, isActive: isActive ?? true });
    return res.status(201).json({ success: true, faq });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;
    const faq = await FAQ.findByIdAndUpdate(req.params.id, { question, answer, order, isActive }, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.status(200).json({ success: true, faq });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getFaqs, getFaq, addFaq, updateFaq, deleteFaq };
