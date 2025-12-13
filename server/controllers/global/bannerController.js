const Banner = require("../../model/bannerModel");

// Reading entire banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.findOne();

    return res.status(200).json({ banners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get active home banner for public use
const getActiveHomeBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    
    if (!banner || !banner.homeBanners) {
      return res.status(200).json({ activeBanner: null });
    }

    // Find the active banner
    let activeBanner = null;
    if (banner.homeBanners.banner1?.isActive) activeBanner = banner.homeBanners.banner1;
    else if (banner.homeBanners.banner2?.isActive) activeBanner = banner.homeBanners.banner2;
    else if (banner.homeBanners.banner3?.isActive) activeBanner = banner.homeBanners.banner3;

    return res.status(200).json({ activeBanner });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all home banners for public use (separate banners for different locations)
const getAllHomeBanners = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    
    if (!banner || !banner.homeBanners) {
      return res.status(200).json({ homeBanners: null });
    }

    return res.status(200).json({ homeBanners: banner.homeBanners });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getBanners,
  getActiveHomeBanner,
  getAllHomeBanners,
};
