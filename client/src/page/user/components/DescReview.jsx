import React, { useEffect, useState } from "react";
import { renderStars } from "../../../Common/functions";
import axios from "axios";
import { HiTrash } from "react-icons/hi";

const DescReview = ({ product: initialProduct, id }) => {
  const [activeTab, setActiveTab] = useState("description");
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

  const URL = "http://localhost:3000/api";

  const loadReviews = async () => {
    if (!id) return;
    
    try { 
      const { data } = await axios.get(`${URL}/user/reviews/${id}`, {
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
      const { data } = await axios.post(
        `${URL}/user/review/${product._id}`,
        {
          product: id,
          rating: newReview.rating,
          title: newReview.title,
          body: newReview.body,
        },
        { withCredentials: true }
      );
  
      const updatedReviews = [...reviews, {...data.review, isUserReview: true}];
      setReviews(updatedReviews);
      updateRatingCounts(updatedReviews);
      setUserHasReviewed(true);
      setUserReviewId(data.review._id);
      setNewReview({ rating: 0, title: "", body: "" });
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
      await axios.delete(`${URL}/user/review/${reviewId}`, {
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
        <div className="flex justify-center border-b">
          <button
            className={`w-1/2 py-3 px-4 text-sm uppercase transition-colors duration-300 text-center 
              ${activeTab === 'description' 
                ? 'border-b-2 border-red-500 text-red-500 font-semibold' 
                : 'text-gray-500 hover:text-red-300'}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`w-1/2 py-3 px-4 text-sm uppercase transition-colors duration-300 text-center 
              ${activeTab === 'reviews' 
                ? 'border-b-2 border-red-500 text-red-500 font-semibold' 
                : 'text-gray-500 hover:text-red-300'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="p-4 sm:p-6">
            <p className="text-gray-600">{product.description}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
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
                      
                      {review.isUserReview && (
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
                    <textarea
                      value={newReview.body}
                      onChange={(e) =>
                        setNewReview({ ...newReview, body: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="4"
                      placeholder="Share your detailed experience..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm sm:text-base"
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
        )}
      </div>
    </div>
  );
};

export default DescReview;