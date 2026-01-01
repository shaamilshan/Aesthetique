const Setting = require('../../model/settingModel');

exports.getPublicSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const s = await Setting.findOne({ key });
    // Return only the value to public consumers
    return res.status(200).json(s ? s.value : null);
  } catch (err) {
    console.error('getPublicSetting error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
