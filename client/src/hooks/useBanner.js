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
        const response = await axios.get(`${URL}/public/home-banners`);
        setBanners({
          banner1: response.data.homeBanners?.banner1 || null,
          banner2: response.data.homeBanners?.banner2 || null,
          banner3: response.data.homeBanners?.banner3 || null
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