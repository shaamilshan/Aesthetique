import React, { useState, useEffect } from 'react';
import { URL } from '@/Common/api';
import { config, configMultiPart } from '@/Common/configurations';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomeBannerManager = () => {
  const [banners, setBanners] = useState({
    banner1: { images: [], title: '', subtitle: '', isActive: true },
    banner2: { images: [], title: '', subtitle: '', isActive: false },
    banner3: { images: [], title: '', subtitle: '', isActive: false }
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});

  // Fetch current banners
  useEffect(() => {
    fetchBanners();
  }, []);

  // Global carousel removed from admin UI per request; only per-banner images are managed here.

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${URL}/admin/home-banners`, config);
      if (response.data.homeBanners) {
        const hb = response.data.homeBanners;
        const normalize = (b) => {
          if (!b) return null;
          if (Array.isArray(b.images)) return b;
          if (b.image) return { ...b, images: [b.image] };
          return { ...b, images: [] };
        };
        setBanners(prev => ({
          banner1: normalize(hb.banner1) || prev.banner1,
          banner2: normalize(hb.banner2) || prev.banner2,
          banner3: normalize(hb.banner3) || prev.banner3
        }));
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      // Don't show error toast on initial load if no banners exist yet
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (bannerNumber, data, file = null) => {
    setUploading(prev => ({ ...prev, [bannerNumber]: true }));
    
    try {
      const formData = new FormData();
      if (file) {
        // file can be a FileList or a single File
        if (file instanceof FileList || Array.isArray(file)) {
          Array.from(file).forEach((f) => formData.append('images', f));
        } else {
          formData.append('images', file);
        }
      }

      // include optional data fields (title/subtitle/isActive)
      if (data) {
        Object.keys(data).forEach((k) => formData.append(k, data[k]));
      }

      const response = await axios.put(
        `${URL}/admin/home-banners/${bannerNumber}`,
        formData,
        configMultiPart
      );

  toast.success(`Banner updated successfully`);
  fetchBanners(); // Refresh data
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error(`Failed to update banner`);
    } finally {
      setUploading(prev => ({ ...prev, [bannerNumber]: false }));
    }
  };

  

  const deleteBanner = async (bannerNumber) => {
    try {
      await axios.delete(`${URL}/admin/home-banners/${bannerNumber}`, config);
      toast.success(`Banner deleted successfully`);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error(`Failed to delete banner`);
    }
  };

  const handleFileChange = (bannerNumber, files) => {
    if (files && files.length > 0) {
      updateBanner(bannerNumber, {}, files);
    }
  };

  const handleDeleteBannerImage = async (bannerNumber, img) => {
    try {
      await axios.delete(`${URL}/admin/home-banners/${bannerNumber}?image=${encodeURIComponent(img)}`, config);
      toast.success('Image removed');
      fetchBanners();
    } catch (err) {
      console.error('Failed to delete banner image', err);
      toast.error('Failed to remove image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const bannerLabels = {
    banner1: { name: 'Banner 1', location: 'After About Us section' },
    banner2: { name: 'Banner 2', location: 'Below Banner 1, before Products' },
    banner3: { name: 'Banner 3', location: 'Between Products & Contact' }
  };
 
  return (
    <div className="w-full bg-white p-5 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">Home Banner Management</h2>
        <div className="text-sm text-gray-500">
          Each banner appears in a different location on the home page
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(banners).map(([bannerKey, banner]) => (
          <div
            key={bannerKey}
            className="border rounded-lg p-4 border-gray-200"
          >
            <div className="flex flex-col mb-4">
              <h3 className="font-semibold text-lg">
                {bannerLabels[bannerKey].name}
              </h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                📍 {bannerLabels[bannerKey].location}
              </span>
            </div>

            {/* Image Preview */}
            <div className="mb-4">
              {banner.images && banner.images.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {banner.images.map((img, idx) => (
                    <div key={idx} className="relative w-32 h-20 rounded-md overflow-hidden">
                      <img src={img?.startsWith?.('http') ? img : `${URL}/img/${img}`} alt={`b-${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1">
                        <button onClick={() => handleDeleteBannerImage(bannerKey, img)} className="bg-black text-white text-xs px-2 py-1 rounded">x</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-md">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image(s)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(bannerKey, e.target.files)}
                className="w-full text-sm border border-gray-300 rounded-md p-2"
                disabled={uploading[bannerKey]}
              />
              {uploading[bannerKey] && (
                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
              )}
            </div>

            {/* Delete Button (clear all images) */}
            {banner.images && banner.images.length > 0 && (
              <button
                onClick={() => deleteBanner(bannerKey)}
                className="w-full bg-black text-white py-2 px-4 rounded-md text-sm hover:bg-gray-900"
              >
                Clear Banner Images
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Banner 1:</strong> Appears after About Us section</li>
          <li>• <strong>Banner 2:</strong> Appears below Banner 1, before Products</li>
          <li>• <strong>Banner 3:</strong> Appears between Products and Contact sections</li>
          <li>• Upload images for each banner slot (banners without images won't be shown)</li>
          <li>• Recommended image size: 1920x1080px or similar aspect ratio</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeBannerManager;