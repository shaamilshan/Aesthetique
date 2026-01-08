import { useState, useEffect } from 'react';
import { URL } from '@/Common/api';
import axios from 'axios';

export const useBanner = () => {
  const [banners, setBanners] = useState({
    banner1: null,
    banner2: null,
    banner3: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);

        // Fetch only home banners (do not fall back to global banners)
        const homeRes = await axios.get(`${URL}/public/home-banners`);
        const home = homeRes.data.homeBanners || {};

        // Helper to normalize a banner into an object with images[] and other fields
        const normalize = (bannerObj) => {
          if (!bannerObj) return null;
          // If banner already provides images array, use it
          if (Array.isArray(bannerObj.images) && bannerObj.images.length > 0) {
            return bannerObj;
          }
          // If banner has a single image field, convert it to images array
          const images = [];
          if (bannerObj.image) images.push(bannerObj.image);
          return { ...bannerObj, images };
        };

        setBanners({
          banner1: normalize(home.banner1) || null,
          banner2: normalize(home.banner2) || null,
          banner3: normalize(home.banner3) || null,
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching home banners:', err);
        setError(err.message);
        setBanners({ banner1: null, banner2: null, banner3: null });
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return { banners, loading, error };
};

export default useBanner;