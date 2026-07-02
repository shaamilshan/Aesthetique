const Review = require("../../model/reviewModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Product = require("../../model/productModel");
const Order = require("../../model/orderModel");
const User = require("../../model/userModel");

// Creating a new review for each product
const createNewReview = async (req, res) => {
  try {
    const token = req.cookies.user_token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (jwtError) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { _id } = decoded;
    const { product, rating, title, body } = req.body;

    // Validate input fields
    if (!product || rating === undefined || !title || !body) {
      return res.status(400).json({ error: "Missing required review fields" });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Verify product exists
    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ error: "Product not found." }); 
    }

    // Process files
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path || file.filename);
    }

    const existingReview = await Review.findOne({ 
      user: _id, 
      product 
    });
    
    let review;
    let isNewReview = false;

    if (existingReview) {
      // Update existing review
      existingReview.rating = ratingNum;
      existingReview.title = title;
      existingReview.body = body;
      existingReview.isUpdated = true;
      if (imagePaths.length > 0) {
        existingReview.images = imagePaths;
      }
      review = await existingReview.save();
    } else {
      // Create new review
      review = await Review.create({
        user: _id,
        product,
        rating: ratingNum,
        title,
        body,
        images: imagePaths
      });
      
      isNewReview = true;
    }

    // Recalculate product rating
    const allReviews = await Review.find({ product });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const newRating = totalRating / allReviews.length;

    // Update product rating
    await Product.findByIdAndUpdate(
      product,
      { 
        $set: { ...(newRating && { rating: newRating }), numberOfReviews: allReviews.length }

      },
      { new: true }
    );

    res.status(isNewReview ? 201 : 200).json({ 
      success: true, 
      review,
      message: isNewReview ? "Review created successfully" : "Review updated successfully"
    });
  } catch (error) {
    console.error("Review creation/update error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


// Reading all the review from product details page
const readProductReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch reviews with user details, sorted by most recent
    const reviews = await Review.find({ product: id })
      .populate("user", {
        firstName: 1,
        lastName: 1,
        profileImgURL: 1,
      })
      .sort({ createdAt: -1 }); // Sort by most recent first

    // Prepare response with additional metadata
    const reviewsResponse = reviews.map(review => ({
      _id: review._id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      images: review.images || [],
      createdAt: review.createdAt,
      isUpdated: review.isUpdated,
      user: {
        _id: review.user._id,
        firstName: review.user.firstName,
        lastName: review.user.lastName,
        profileImgURL: review.user.profileImgURL
      }
    }));

    let currentUserId = null;
    const token = req.cookies.user_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        currentUserId = decoded._id;
      } catch (jwtError) {
        // ignore invalid token
      }
    }

    res.status(200).json({ 
      reviews: reviewsResponse,
      totalReviews: reviews.length,
      currentUserId
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Reading a specific user's review for a product
const readProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    // Check for user token
    const token = req.cookies.user_token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify token and extract user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (jwtError) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(decoded._id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // Find review for the specific product and user
    const review = await Review.findOne({ 
      product: id, 
      user: decoded._id 
    }).populate('product', 'name imageURL');

    // Handle case when no review is found
    if (!review) {
      return res.status(404).json({ 
        message: "No review found for this product",
        canReview: true 
      });
    }

    // Successful response with review details
    res.status(200).json({ 
      review: {
        _id: review._id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        images: review.images || [],
        createdAt: review.createdAt,
        isUpdated: review.isUpdated,
        product: review.product
      }
    });
  } catch (error) {
    console.error("Error fetching user's product review:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


// Read user reviews on order history page
const readOrderReview = async (req, res) => {
  try {
    const token = req.cookies.user_token;

    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) { 
      throw Error("Invalid user Id!!!");
    }

    // Fetching order Id
    const { id } = req.params;
    let find = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      find.orderId = id;
    }
    const order = await Order.findOne(find);

    const reviews = await Review.find({ order: order._id, user: _id }).populate(
      "user",
      {
        firstName: 1,
        lastName: 1,
        profileImgURL: 1,
      }
    );
    if (!reviews) {
      throw Error("No Review Found");
    }

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deleting a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization token
    const token = req.cookies.user_token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "No review found" });
    }

    // Only allow deletion if it is the user's own review, or if they are superAdmin/admin
    if (
      review.user.toString() !== currentUser._id.toString() &&
      currentUser.role !== "superAdmin" &&
      currentUser.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden: You are not authorized to delete this review" });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const newRating = allReviews.length > 0 ? (totalRating / allReviews.length) : 0;

    // Update product rating
    await Product.findByIdAndUpdate(
      productId,
      { 
        $set: { rating: newRating, numberOfReviews: allReviews.length }
      },
      { new: true }
    );

    res.status(200).json({ review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Editing the review
const editReview = async (req, res) => {
  try {
    const { id } = req.params;

    const body = req.body;

    const existingReview = await Review.findOne({
      _id: id,
    });

    if (!existingReview) {
      throw Error("Review not found");
    }

    const product = await Product.findOne({ _id: body.product });
    if (!product) {
      throw Error("Product not found");
    }

    // Calculate the change in rating
    const ratingChange = body.rating - existingReview.rating;

    // Update the product rating and number of reviews
    const newRating =
      (product.rating * product.numberOfReviews + ratingChange) /
      product.numberOfReviews;

    await Product.findByIdAndUpdate(  
      body.product,
      {
        $set: {
          rating: newRating,
        },
      },
      { new: true }
    );

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      existingReview._id,
      {
        $set: {
          ...body,
        },
      },
      { new: true }
    ).populate("user", {
      firstName: 1,
      lastName: 1,
      profileImgURL: 1,
    });

    res.status(200).json({ review: updatedReview });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNewReview,
  readProductReviews,
  readProductReview,
  deleteReview,
  editReview,
  readOrderReview,
};
