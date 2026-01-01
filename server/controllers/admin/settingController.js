const Setting = require('../../model/settingModel');

exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const s = await Setting.findOne({ key });
    return res.status(200).json(s || null);
  } catch (err) {
    console.error('getSetting error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.upsertSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    // Debug: log incoming payload to help diagnose connection/save issues during development
    console.log(`upsertSetting called for key=${key} type=${typeof value} sample=`, Array.isArray(value) ? value.slice(0,5) : value);
    const s = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(s);
  } catch (err) {
    console.error('upsertSetting error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
