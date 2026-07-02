import React, { useEffect, useState } from "react";
import { renderStars, getImageUrl } from "../../../Common/functions";
import axios from "axios";
import { HiTrash, HiCamera, HiX, HiChevronLeft, HiChevronRight, HiLockClosed } from "react-icons/hi";
import { URL } from "@/Common/api";
import { useSelector } from "react-redux";
const DescReview = ({ product: initialProduct, id }) => {
  const { user } = useSelector((state) => state.user) || {};
  const [reviews, setReviews] = useState([]);
  const [ratingCount, setRatingCount] = useState(Array(5).fill(0));
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(initialProduct);
  const [newReview, setNewReview] = useState({ 
    rating: 0, 
    title: "",
    body: ""
  });  
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReviewId, setUserReviewId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // [{ file: File, preview: string }]
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if total images exceeds 3
    if (selectedImages.length + files.length > 3) {
      setError("You can only upload up to 3 images.");
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: window.URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const removeSelectedImage = (index) => {
    window.URL.revokeObjectURL(selectedImages[index].preview);
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const openLightbox = (imagesList, index) => {
    setLightbox({
      isOpen: true,
      images: imagesList,
      currentIndex: index
    });
  };

  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      images: [],
      currentIndex: 0
    });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  const URLapi = URL;

  const loadReviews = async () => {
    if (!id) return;
    
    try { 
      const { data } = await axios.get(`${URLapi}/user/reviews/${id}`, {
        withCredentials: true,
      });

      // Process reviews to identify the current user's review
      const processedReviews = data.reviews.map(review => ({
        ...review,
        // This assumes your API includes user information in the review
        isUserReview: review.user?._id === data.currentUserId // Adjust based on your API response
      }));

      setReviews(processedReviews);
      updateRatingCounts(processedReviews);
      
      // Find the user's review if it exists
      const userReview = processedReviews.find(review => review.isUserReview);
      if (userReview) {
        setUserHasReviewed(true);
        setUserReviewId(userReview._id);
      } else {
        setUserHasReviewed(false);
        setUserReviewId(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.response?.data?.error || "Failed to fetch reviews");
    }
  };

  const updateRatingCounts = (reviewList) => {
    const ratingCounts = Array(5).fill(0);
    reviewList.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });
    setRatingCount(ratingCounts);
    
    if (reviewList.length > 0) {
      const totalRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
      const newRating = totalRating / reviewList.length;
      setProduct(prev => ({
        ...prev,
        rating: parseFloat(newRating.toFixed(1)),
        numberOfReviews: reviewList.length
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        rating: 0,
        numberOfReviews: 0
      }));
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
  
    if (newReview.rating === 0) {
      setError("Please select a rating");
      return;
    }
  
    if (!newReview.title.trim()) {
      setError("Please select a review title");
      return;
    }
  
    if (!newReview.body.trim()) {
      setError("Please provide a review description");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("product", id);
      formData.append("rating", newReview.rating);
      formData.append("title", newReview.title);
      formData.append("body", newReview.body);
      
      selectedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const { data } = await axios.post(
        `${URLapi}/user/review/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
  
      const updatedReviews = [...reviews, {...data.review, isUserReview: true}];
      setReviews(updatedReviews);
      updateRatingCounts(updatedReviews);
      setUserHasReviewed(true);
      setUserReviewId(data.review._id);
      setNewReview({ rating: 0, title: "", body: "" });
      // Revoke the object URLs to avoid memory leak
      selectedImages.forEach((img) => window.URL.revokeObjectURL(img.preview));
      setSelectedImages([]);
      setError(null);
    } catch (error) {
      console.error("Error adding review:", error);
      setError(error.response?.data?.error || "Failed to add review");
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;
    
    setIsDeleting(true);
    
    try {
      await axios.delete(`${URLapi}/user/review/${reviewId}`, {
        withCredentials: true,
      });
      
      const updatedReviews = reviews.filter(review => review._id !== reviewId);
      setReviews(updatedReviews);
      updateRatingCounts(updatedReviews);
      
      // Reset user review state after deletion
      setUserHasReviewed(false);
      setUserReviewId(null);
      
    } catch (error) {
      console.error("Error deleting review:", error);
      setError(error.response?.data?.error || "Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      loadReviews();
    }
  }, [id]);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const getReviewTitles = (rating) => {
    const titleSets = {
      1: [
        "Needs Major Improvement",
        "Highly Disappointing",
        "Not Recommended",
        "Significant Issues",
        "Far Below Expectations"
      ],
      2: [
        "Below Expectations",
        "Some Potential",
        "Needs Work",
        "Mostly Unsatisfactory",
        "Limited Value"
      ],
      3: [
        "Average Performance",
        "Meets Basic Needs",
        "Neutral Experience",
        "Middle of the Road",
        "No Strong Feelings"
      ],
      4: [
        "Very Good Product",
        "Mostly Satisfied",
        "Recommended",
        "Exceeded Expectations",
        "Strong Performance"
      ],
      5: [
        "Exceptional!",
        "Absolutely Amazing",
        "Best in Class",
        "Perfect Product",
        "Highly Recommend"
      ]
    };

    return titleSets[rating] || [];
  };

  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* <div className="border-b py-3 px-4">
          <h2 className="text-lg font-semibold text-center uppercase text-gray-800">Reviews</h2>
        </div> */}

        <div className="p-4 sm:p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="absolute top-0 right-0 p-3"
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <h2 className="text-4xl font-bold mb-2">
                  {product.rating ? 
                    (Number.isInteger(product.rating) 
                      ? `${product.rating}.0` 
                      : product.rating.toFixed(1)) 
                    : "N/A"}
                </h2>
                <div className="flex justify-center mb-2">
                  {renderStars(product.rating)}
                </div>
                <p className="text-gray-600">Based on {product.numberOfReviews || 0} Reviews</p>
              </div>

              <div className="space-y-3">
                {ratingCount && ratingCount.slice().reverse().map((count, index) => {
                  const starRating = 5 - index;
                  const percentage = product.numberOfReviews 
                    ? parseInt((count / product.numberOfReviews) * 100)
                    : 0;
                  
                  return (
                    <div key={starRating} className="flex items-center space-x-3">
                      <div className="flex items-center w-16">
                        {renderStars(starRating)}
                      </div>
                      <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {percentage}% ({count})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic text-sm sm:text-base">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map(review => (
                  <div 
                    key={review._id} 
                    className={`border-b py-4 hover:bg-gray-50 px-3 transition-colors duration-200 ${review.isUserReview ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <div className="flex items-center mb-2 sm:mb-0">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-gray-600 text-xs sm:text-sm"> 
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {review.isUserReview && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Your Review
                          </span>
                        )}
                      </div>
                      
                      {(review.isUserReview || user?.role === "superAdmin") && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={isDeleting}
                          className="text-red-500 hover:text-red-700 text-sm transition-colors p-1"
                        >
                          {isDeleting ? (
                            "Deleting..." 
                          ) : (
                            <HiTrash className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                      {review.title}
                    </h4>
                    <p className="text-gray-700 text-xs sm:text-base">
                      {review.body}
                    </p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.images.map((imgUrl, idx) => (
                          <div 
                            key={idx}
                            onClick={() => openLightbox(review.images, idx)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm bg-gray-50 flex items-center justify-center shrink-0"
                          >
                            <img 
                              src={getImageUrl(imgUrl, URLapi)} 
                              alt={`review-img-${idx}`} 
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Show review form if user hasn't reviewed OR if they just deleted their review */}
            {!userHasReviewed ? (
              <div className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Add a Review</h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="">
                    <label className="block mb-2 font-semibold sm:text-lg text-center text-gray-700">
                      Your Rating
                    </label>
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`text-2xl sm:text-3xl mx-1 transition-colors duration-300 ${
                            newReview.rating >= star
                              ? "text-yellow-500 scale-110"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                          onClick={() =>
                            setNewReview({ ...newReview, rating: star, title: "" })
                          }
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {newReview.rating > 0 && (
                    <div className="mb-4">
                      <label className="block mb-2 text-sm sm:text-base text-gray-700">
                        Select a Review Title
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {getReviewTitles(newReview.rating).map((title) => (
                          <button
                            key={title}
                            type="button"
                            className={`py-2 px-3 text-xs sm:text-sm border rounded-lg transition-colors duration-300 ${
                              newReview.title === title
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setNewReview({ ...newReview, title })}
                          >
                            {title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 text-sm sm:text-base text-gray-700">
                      Your Review
                    </label>
                    <div className="w-full border border-gray-300 rounded-lg overflow-hidden focus-within:border-gray-500 bg-white">
                      <textarea
                        value={newReview.body}
                        onChange={(e) =>
                          setNewReview({ ...newReview, body: e.target.value })
                        }
                        className="w-full p-3 text-xs sm:text-sm focus:outline-none resize-none block"
                        rows="4"
                        placeholder="Share your detailed experience..."
                        required
                      ></textarea>
                      
                      {/* Action bar on the bottom left inside/below the text box */}
                      <div className="flex flex-col border-t border-gray-200 p-2 bg-gray-50">
                        {/* Selected Previews */}
                        {selectedImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {selectedImages.map((img, index) => (
                              <div key={index} className="relative w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center">
                                <img src={img.preview} alt={`preview-${index}`} className="object-cover w-full h-full" />
                                <button
                                  type="button"
                                  onClick={() => removeSelectedImage(index)}
                                  className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow transition-colors"
                                >
                                  <HiX className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center">
                          {selectedImages.length < 3 ? (
                            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 rounded-md text-gray-500 text-xs sm:text-sm transition-colors duration-200">
                              <HiCamera className="w-4 h-4" />
                              <span className="font-medium text-xs sm:text-sm">Add Photo ({selectedImages.length}/3)</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <span className="text-[11px] sm:text-xs text-gray-400 font-medium">Max 3 photos added</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300 text-sm sm:text-base"
                    disabled={!newReview.rating || !newReview.title}
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-6 bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
                <p className="text-blue-800 font-medium">
                  A review has already been submitted for this product.
                </p>
              </div>
            )}
          </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && lightbox.images.length > 0 && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
          >
            <HiX className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {lightbox.images.length > 1 && (
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
            >
              <HiChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
          )}

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
          >
            <img 
              src={getImageUrl(lightbox.images[lightbox.currentIndex], URLapi)} 
              alt={`lightbox-${lightbox.currentIndex}`} 
              className="object-contain max-w-full max-h-[80vh] rounded shadow-2xl animate-fade-in"
            />
            {/* Image Indicator */}
            <div className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium">
              {lightbox.currentIndex + 1} / {lightbox.images.length}
            </div>
          </div>

          {lightbox.images.length > 1 && (
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
            >
              <HiChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
          )}
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginModal && (
        <div 
          onClick={() => setShowLoginModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative border border-gray-100 transform scale-100 transition-all duration-300"
          >
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <HiX className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 text-red-500 rounded-full p-3.5 shadow-inner animate-bounce">
                <HiLockClosed className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              To write a review and upload photos, you must be signed in to your account.
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="/login" 
                className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow hover:shadow-md transition-all duration-200 text-sm animate-pulse"
              >
                Log In
              </a>
              <a 
                href="/register" 
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-300 rounded-full hover:border-gray-400 transition-all duration-200 text-sm"
              >
                Create Account
              </a>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-full text-xs text-gray-400 hover:text-gray-500 transition-colors mt-1 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescReview;