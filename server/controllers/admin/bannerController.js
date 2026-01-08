const Banner = require("../../model/bannerModel");

// Creating Banner collection for first time. if already existing just pushing the banners to existing array.
const addBanners = async (req, res) => {
  try {
    const files = req?.files;

    let filesNames = [];

    if (files && files.length > 0) {
      files.forEach((file) => filesNames.push(file.path || file.filename));
    } else {
      throw Error("No files are uploaded");
    }

    const exists = await Banner.findOne();

    let banners = "";
    if (!exists) {
      banners = await Banner.create({ images: filesNames });
    } else {
      banners = await Banner.findByIdAndUpdate(
        exists._id,
        {
          $push: {
            images: filesNames,
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({ banners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reading entire banners
const readBanners = async (req, res) => {
  try {
    const banners = await Banner.findOne();

    return res.status(200).json({ banners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deleting one banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Banner.findOne();

    const banners = await Banner.findByIdAndUpdate(
      exists._id,
      {
        $pull: {
          images: id,
        },
      },
      { new: true }
    );

    return res.status(200).json({ banners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Updating the listing order
const updateBannerOrder = async (req, res) => {
  try {
    const { images } = req.body;

    const exists = await Banner.findOne();

    if (!exists) {
      throw Error("No Banner Collection in the DB");
    }

    const banners = await Banner.findByIdAndUpdate(
      exists._id,
      {
        $set: {
          images: images,
        },
      },
      { new: true }
    );

    return res.status(200).json({ banners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update home banner
const updateHomeBanner = async (req, res) => {
  try {
    const { bannerNumber } = req.params; // banner1, banner2, or banner3
    const { title, subtitle, isActive } = req.body;
    const files = req?.files || [];

    if (!['banner1', 'banner2', 'banner3'].includes(bannerNumber)) {
      return res.status(400).json({ error: "Invalid banner number. Use banner1, banner2, or banner3" });
    }

    let exists = await Banner.findOne();
    
    if (!exists) {
      exists = await Banner.create({
        homeBanners: {
          banner1: { images: [], title: '', subtitle: '', isActive: true },
          banner2: { images: [], title: '', subtitle: '', isActive: false },
          banner3: { images: [], title: '', subtitle: '', isActive: false }
        }
      });
    }

    // Build update object for title/subtitle/isActive
    const updateData = {};
    if (title !== undefined) updateData[`homeBanners.${bannerNumber}.title`] = title;
    if (subtitle !== undefined) updateData[`homeBanners.${bannerNumber}.subtitle`] = subtitle;
    if (isActive !== undefined) updateData[`homeBanners.${bannerNumber}.isActive`] = isActive;

    // If files provided, push them into the banner's images array
    if (files.length > 0) {
      const filePaths = files.map(f => f.path || f.filename);
      // Use $push with $each to append multiple images
      const updated = await Banner.findByIdAndUpdate(
        exists._id,
        { $push: { [`homeBanners.${bannerNumber}.images`]: { $each: filePaths } }, $set: updateData },
        { new: true }
      );
      return res.status(200).json({ banner: updated });
    }

    const banner = await Banner.findByIdAndUpdate(
      exists._id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({ banner });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get home banners
const getHomeBanners = async (req, res) => {
  try {
    let banner = await Banner.findOne();
    
    if (!banner) {
      banner = await Banner.create({
        homeBanners: {
          banner1: { images: [], title: 'Banner 1', subtitle: 'Description for banner 1', isActive: true },
          banner2: { images: [], title: 'Banner 2', subtitle: 'Description for banner 2', isActive: false },
          banner3: { images: [], title: 'Banner 3', subtitle: 'Description for banner 3', isActive: false }
        }
      });
    }

    return res.status(200).json({ homeBanners: banner.homeBanners || {} });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Set active home banner
const setActiveHomeBanner = async (req, res) => {
  try {
    const { bannerNumber } = req.params;

    if (!['banner1', 'banner2', 'banner3'].includes(bannerNumber)) {
      return res.status(400).json({ error: "Invalid banner number" });
    }

    let exists = await Banner.findOne();
    
    if (!exists) {
      return res.status(404).json({ error: "No banners found" });
    }

    // Set all banners to inactive, then activate the selected one
    const banner = await Banner.findByIdAndUpdate(
      exists._id,
      {
        $set: {
          'homeBanners.banner1.isActive': bannerNumber === 'banner1',
          'homeBanners.banner2.isActive': bannerNumber === 'banner2',
          'homeBanners.banner3.isActive': bannerNumber === 'banner3'
        }
      },
      { new: true }
    );

    return res.status(200).json({ banner });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete home banner image or a specific image from the banner's images array
const deleteHomeBanner = async (req, res) => {
  try {
    const { bannerNumber } = req.params;
    const { image } = req.query; // optional image path to remove

    if (!['banner1', 'banner2', 'banner3'].includes(bannerNumber)) {
      return res.status(400).json({ error: "Invalid banner number" });
    }

    let exists = await Banner.findOne();
    
    if (!exists) {
      return res.status(404).json({ error: "No banners found" });
    }

    let banner;
    if (image) {
      // remove specific image from images array
      banner = await Banner.findByIdAndUpdate(
        exists._id,
        { $pull: { [`homeBanners.${bannerNumber}.images`]: image } },
        { new: true }
      );
    } else {
      // clear all images for this banner
      banner = await Banner.findByIdAndUpdate(
        exists._id,
        { $set: { [`homeBanners.${bannerNumber}.images`]: [] } },
        { new: true }
      );
    }

    return res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addBanners,
  readBanners,
  deleteBanner,
  updateBannerOrder,
  updateHomeBanner,
  getHomeBanners,
  setActiveHomeBanner,
  deleteHomeBanner,
};
