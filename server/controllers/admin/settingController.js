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
    let settingValue = req.body.value;

    if (typeof settingValue === 'string') {
      try {
        settingValue = JSON.parse(settingValue);
      } catch (e) {
        // Keep as string if it's a simple string value
      }
    } else if (!settingValue && (req.body.isActive !== undefined || req.body.productId !== undefined)) {
      settingValue = { ...req.body };
    }

    if (!settingValue) {
      settingValue = {};
    }

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const imageUrl = file.path || file.filename;
        if (typeof settingValue === 'object') {
          if (file.fieldname && file.fieldname.startsWith('offer_image_')) {
            const index = parseInt(file.fieldname.replace('offer_image_', ''), 10);
            if (!isNaN(index) && Array.isArray(settingValue.offers) && settingValue.offers[index]) {
              settingValue.offers[index].imageUrl = imageUrl;
            }
          } else {
            settingValue.imageUrl = imageUrl;
            if (Array.isArray(settingValue.offers) && settingValue.offers.length > 0) {
              settingValue.offers[0].imageUrl = imageUrl;
            }
          }
        }
      });
    }

    console.log(`upsertSetting called for key=${key}`, settingValue);
    const s = await Setting.findOneAndUpdate(
      { key },
      { value: settingValue },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(s);
  } catch (err) {
    console.error('upsertSetting error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
