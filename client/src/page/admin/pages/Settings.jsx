import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { commonRequest, URL } from "@/Common/api";
import { getImageUrl } from "@/Common/functions";
import { 
  Settings as SettingsIcon, 
  Save, 
  ToggleLeft, 
  ToggleRight, 
  Image as ImageIcon, 
  ShoppingBag, 
  Sparkles,
  Upload,
  Eye,
  Plus,
  Trash2
} from "lucide-react";
import { HiX } from "react-icons/hi";

// Default fallback promo image asset
import popup1 from "@/assets/others/popup1.jpg";

const defaultOffers = [
  {
    id: "offer-1",
    headline: "Join Our\nMailing List",
    subtitle: "Stay Informed! Monthly Tips, Tracks and Discount.",
    buttonText: "BUY NOW",
    imageUrl: "",
    productId: ""
  },
  {
    id: "offer-2",
    headline: "Exclusive\nGlow Deal",
    subtitle: "Get 20% OFF Hyaluronic Boost Serum today!",
    buttonText: "BUY NOW",
    imageUrl: "",
    productId: ""
  }
];

const Settings = () => {
  const [popupData, setPopupData] = useState({
    isActive: true,
    autoSlide: true,
    offers: defaultOffers
  });

  const [previewModalIndex, setPreviewModalIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [imageFiles, setImageFiles] = useState({}); // { [index]: File }
  const [imagePreviews, setImagePreviews] = useState({}); // { [index]: string }
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch settings & product list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const settingRes = await commonRequest("GET", "/admin/setting/popup_promo");
        if (settingRes && settingRes.value && typeof settingRes.value === "object") {
          const val = settingRes.value;
          let loadedOffers = val.offers;

          // Backward compatibility if single offer was stored
          if (!Array.isArray(loadedOffers) || loadedOffers.length === 0) {
            if (val.headline || val.imageUrl || val.productId) {
              loadedOffers = [{
                id: "offer-1",
                headline: val.headline || "Join Our\nMailing List",
                subtitle: val.subtitle || "Stay Informed! Monthly Tips, Tracks and Discount.",
                buttonText: val.buttonText || "BUY NOW",
                imageUrl: val.imageUrl || "",
                productId: val.productId || ""
              }];
            } else {
              loadedOffers = defaultOffers;
            }
          }

          setPopupData({
            isActive: val.isActive !== undefined ? val.isActive : true,
            autoSlide: val.autoSlide !== undefined ? val.autoSlide : true,
            offers: loadedOffers
          });

          // Set initial image previews
          const initialPreviews = {};
          loadedOffers.forEach((off, idx) => {
            if (off.imageUrl) {
              initialPreviews[idx] = getImageUrl(off.imageUrl, URL);
            }
          });
          setImagePreviews(initialPreviews);
        }

        // Fetch products for dropdown
        const productRes = await commonRequest("GET", "/admin/products?limit=200");
        if (productRes && productRes.products) {
          setProducts(productRes.products);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        toast.error("Failed to load settings data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateOffer = (index, field, value) => {
    setPopupData(prev => {
      const updatedOffers = [...prev.offers];
      updatedOffers[index] = {
        ...updatedOffers[index],
        [field]: value
      };
      return { ...prev, offers: updatedOffers };
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles(prev => ({ ...prev, [index]: file }));
      setImagePreviews(prev => ({ ...prev, [index]: window.URL.createObjectURL(file) }));
    }
  };

  const handleAddOffer = () => {
    const newOffer = {
      id: `offer-${Date.now()}`,
      headline: `Special Offer ${popupData.offers.length + 1}`,
      subtitle: "Limited Time Discount",
      buttonText: "BUY NOW",
      imageUrl: "",
      productId: ""
    };
    setPopupData(prev => ({
      ...prev,
      offers: [...prev.offers, newOffer]
    }));
  };

  const handleDeleteOffer = (indexToDelete) => {
    if (popupData.offers.length <= 1) {
      toast.error("At least one offer is required.");
      return;
    }

    setPopupData(prev => {
      const filtered = prev.offers.filter((_, idx) => idx !== indexToDelete);
      return { ...prev, offers: filtered };
    });

    if (previewModalIndex === indexToDelete) {
      setPreviewModalIndex(null);
    } else if (previewModalIndex > indexToDelete) {
      setPreviewModalIndex(prev => prev - 1);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hasFiles = Object.keys(imageFiles).length > 0;

      if (hasFiles) {
        const formData = new FormData();
        Object.keys(imageFiles).forEach(idx => {
          if (imageFiles[idx]) {
            formData.append(`offer_image_${idx}`, imageFiles[idx]);
          }
        });
        formData.append("value", JSON.stringify(popupData));

        const response = await commonRequest("PUT", "/admin/setting/popup_promo", formData);
        if (response && !response.error) {
          toast.success("Popup settings updated successfully!");
          if (response.value && Array.isArray(response.value.offers)) {
            setPopupData(prev => ({ ...prev, offers: response.value.offers }));
            const updatedPreviews = {};
            response.value.offers.forEach((off, idx) => {
              if (off.imageUrl) {
                updatedPreviews[idx] = getImageUrl(off.imageUrl, URL);
              }
            });
            setImagePreviews(updatedPreviews);
          }
          setImageFiles({});
        } else {
          toast.error(response?.error || "Failed to update popup settings");
        }
      } else {
        const response = await commonRequest("PUT", "/admin/setting/popup_promo", {
          value: popupData
        });
        if (response && !response.error) {
          toast.success("Popup settings updated successfully!");
        } else {
          toast.error(response?.error || "Failed to update popup settings");
        }
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("An error occurred while saving popup settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm">Loading popup settings...</p>
        </div>
      </div>
    );
  }

  const modalOffer = previewModalIndex !== null ? popupData.offers[previewModalIndex] : null;
  const modalProd = modalOffer ? products.find(p => p._id === modalOffer.productId) : null;
  const modalImageSrc = modalOffer ? (imagePreviews[previewModalIndex] || (modalOffer.imageUrl ? getImageUrl(modalOffer.imageUrl, URL) : (modalProd && modalProd.imageURL ? getImageUrl(modalProd.imageURL, URL) : popup1))) : popup1;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-black text-white rounded-2xl shadow-sm">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Popup Promotion Manager</h1>
            <p className="text-gray-500 mt-1">Configure multi-offer popup banners with linked products for instant checkout.</p>
          </div>
        </div>
      </div>

      {/* Settings Controls (Toggles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
              {/* <Sparkles size={18} className="text-amber-500" /> */}
              Enable Popup Modal
            </span>
            <p className="text-xs text-gray-500">Show promo popup on visitor arrival.</p>
          </div>
          <button
            type="button"
            onClick={() => setPopupData(prev => ({ ...prev, isActive: !prev.isActive }))}
            className="focus:outline-none transition-transform active:scale-95"
          >
            {popupData.isActive ? (
              <ToggleRight size={40} className="text-black" />
            ) : (
              <ToggleLeft size={40} className="text-gray-300" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Auto-Rotate Offers
            </span>
            <p className="text-xs text-gray-500">Automatically slide between offers every 3s.</p>
          </div>
          <button
            type="button"
            onClick={() => setPopupData(prev => ({ ...prev, autoSlide: !prev.autoSlide }))}
            className="focus:outline-none transition-transform active:scale-95"
          >
            {popupData.autoSlide ? (
              <ToggleRight size={40} className="text-black" />
            ) : (
              <ToggleLeft size={40} className="text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Full-Width Offers Table */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Promotional Offers Table</h2>
            <p className="text-xs text-gray-500">Manage all popup offer slides in a table view. Click the Eye icon to view live preview.</p>
          </div>
          <button
            type="button"
            onClick={handleAddOffer}
            className="bg-black hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Add Offer
          </button>
        </div>

        {/* Full-Width Responsive Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[130px]">Banner Image</th>
                <th className="py-3.5 px-4 min-w-[180px]">Headline Title</th>
                <th className="py-3.5 px-4 min-w-[180px]">Subtitle</th>
                <th className="py-3.5 px-4 min-w-[200px]">Target Product</th>
                <th className="py-3.5 px-4 min-w-[120px]">Button Label</th>
                <th className="py-3.5 px-3 text-center min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-800">
              {popupData.offers.map((offer, index) => (
                <tr 
                  key={offer.id || index}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Number */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                      {index + 1}
                    </span>
                  </td>

                  {/* Banner Image */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-2">
                      <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                        {imagePreviews[index] || offer.imageUrl ? (
                          <img
                            src={imagePreviews[index] || getImageUrl(offer.imageUrl, URL)}
                            alt={`Offer ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>

                      <label className="cursor-pointer inline-flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors text-gray-700">
                        <Upload size={13} />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </td>

                  {/* Headline Title */}
                  <td className="py-3 px-4">
                    <textarea
                      rows={2}
                      value={offer.headline || ""}
                      onChange={(e) => handleUpdateOffer(index, "headline", e.target.value)}
                      placeholder="Headline..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </td>

                  {/* Subtitle */}
                  <td className="py-3 px-4">
                    <textarea
                      rows={2}
                      value={offer.subtitle || ""}
                      onChange={(e) => handleUpdateOffer(index, "subtitle", e.target.value)}
                      placeholder="Subtitle..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </td>

                  {/* Target Product */}
                  <td className="py-3 px-4">
                    <select
                      value={offer.productId || ""}
                      onChange={(e) => handleUpdateOffer(index, "productId", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black font-medium"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map(prod => (
                        <option key={prod._id} value={prod._id}>
                          {prod.name} (₹{prod.price})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Button Label */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={offer.buttonText || "BUY NOW"}
                      onChange={(e) => handleUpdateOffer(index, "buttonText", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </td>

                  {/* Actions (Eye Preview Button & Delete Button) */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewModalIndex(index)}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Live Preview Offer"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOffer(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Save Controls */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleAddOffer}
            className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 bg-gray-100 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> Add New Row
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-zinc-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              <>
                <Save size={18} />
                Save Popup Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Live Preview Dialog when Eye button is clicked */}
      {previewModalIndex !== null && modalOffer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-[820px] w-full flex flex-col md:flex-row border border-gray-100 transition-all duration-300">
            
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setPreviewModalIndex(null)}
              className="absolute top-4 right-4 z-50 text-gray-800 hover:text-black p-1 transition-transform hover:scale-110 focus:outline-none"
              aria-label="Close Preview"
            >
              <HiX className="w-6 h-6" />
            </button>

            {/* Left Image Section */}
            <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[460px] bg-gray-100 relative overflow-hidden flex items-center justify-center">
              <img
                src={modalImageSrc}
                alt={modalOffer.headline || "Offer Preview"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Content Section */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-white relative">
              <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase mb-2">
                PREVIEW: OFFER {previewModalIndex + 1} OF {popupData.offers.length}
              </span>

              <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 font-serif leading-tight mb-4 whitespace-pre-line">
                {modalOffer.headline || `Offer ${previewModalIndex + 1}`}
              </h2>

              <p className="text-gray-500 text-xs sm:text-sm font-normal leading-relaxed max-w-xs mx-auto mb-6">
                {modalOffer.subtitle || "Stay Informed! Monthly Tips, Tracks and Discount."}
              </p>

              {modalProd && (
                <div className="mb-6 text-xs font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2">
                  <span className="truncate max-w-[160px]">{modalProd.name}</span>
                  <span className="font-bold text-black">₹{Number(modalProd.price).toLocaleString()}</span>
                </div>
              )}

              <button
                type="button"
                className="w-full max-w-xs bg-[#111] text-white font-bold py-3.5 px-6 rounded-lg text-xs sm:text-sm uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>{modalOffer.buttonText || "BUY NOW"}</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewModalIndex(null)}
                className="mt-6 flex items-center justify-center text-[11px] font-bold text-gray-600 uppercase tracking-wider"
              >
                <span>NO, THANK YOU</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
