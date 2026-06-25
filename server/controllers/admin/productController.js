const Product = require("../../model/productModel");
const mongoose = require("mongoose");

// Helper: format Mongoose validation errors into user-friendly messages
const formatValidationError = (error) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => {
      if (err.kind === "ObjectId") {
        return `${err.path}: Please select a valid ${err.path}`;
      }
      return err.message;
    });
    return messages.join(". ");
  }
  if (error.name === "CastError" || error.message.includes("BSONError")) {
    if (error.path === "category") {
      return "Please select a valid category";
    }
    return `Invalid value for ${error.path || "a field"}. Please check your input.`;
  }
  return error.message;
};

// Helper: validate product fields before saving
const validateProductFields = (formData, isUpdate = false) => {
  const errors = [];

  // For creation, all required fields must be present
  if (!isUpdate) {
    if (!formData.name || !formData.name.toString().trim()) {
      errors.push("Product name is required");
    }
    if (!formData.description || !formData.description.toString().trim()) {
      errors.push("Product description is required");
    }
    if (formData.price === undefined || formData.price === null || formData.price === "") {
      errors.push("Price is required");
    }
    if (formData.stockQuantity === undefined || formData.stockQuantity === null || formData.stockQuantity === "") {
      errors.push("Stock quantity is required");
    }
    if (!formData.category || formData.category === "undefined" || formData.category === "null" || !formData.category.toString().trim()) {
      errors.push("Please select a category");
    }
    if (!formData.imageURL && (!formData.moreImageURL || formData.moreImageURL.length === 0)) {
      errors.push("At least one product image is required");
    }
  }

  // For both creation and update, validate field values if provided
  if (formData.name !== undefined && formData.name.toString().trim().length === 0) {
    errors.push("Product name cannot be empty");
  }
  if (formData.description !== undefined && formData.description.toString().trim().length > 125) {
    errors.push("Short description cannot exceed 125 characters");
  }
  if (formData.category !== undefined) {
    const cat = formData.category.toString().trim();
    if (cat === "undefined" || cat === "null" || cat === "") {
      errors.push("Please select a valid category");
    } else if (!mongoose.Types.ObjectId.isValid(cat)) {
      errors.push("Invalid category selected. Please choose a category from the list.");
    }
  }
  if (formData.price !== undefined && formData.price !== "") {
    const price = Number(formData.price);
    if (isNaN(price)) {
      errors.push("Price must be a valid number");
    } else if (price < 0) {
      errors.push("Price cannot be negative");
    }
  }
  if (formData.stockQuantity !== undefined && formData.stockQuantity !== "") {
    const stock = Number(formData.stockQuantity);
    if (isNaN(stock)) {
      errors.push("Stock quantity must be a valid number");
    } else if (stock < 0) {
      errors.push("Stock quantity cannot be negative");
    }
  }
  if (formData.markup !== undefined && formData.markup !== "") {
    const markup = Number(formData.markup);
    if (isNaN(markup)) {
      errors.push("Strike price (MRP) must be a valid number");
    } else if (markup < 0) {
      errors.push("Strike price (MRP) cannot be negative");
    }
  }
  if (formData.costPrice !== undefined && formData.costPrice !== "") {
    const costPrice = Number(formData.costPrice);
    if (isNaN(costPrice)) {
      errors.push("Cost price must be a valid number");
    } else if (costPrice < 0) {
      errors.push("Cost price cannot be negative");
    }
  }
  if (formData.status !== undefined) {
    const validStatuses = ["draft", "published", "out of stock", "low quantity", "unpublished"];
    if (!validStatuses.includes(formData.status)) {
      errors.push(`Invalid status "${formData.status}". Must be one of: ${validStatuses.join(", ")}`);
    }
  }
  if (formData.gstPercent !== undefined && formData.gstPercent !== "") {
    const gst = Number(formData.gstPercent);
    if (isNaN(gst)) {
      errors.push("GST percentage must be a valid number");
    } else if (gst < 0 || gst > 100) {
      errors.push("GST percentage must be between 0 and 100");
    }
  }

  return errors;
};

// Getting all products to list on admin dashboard
const getProducts = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      startingDate,
      endingDate,
    } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.name = { $regex: new RegExp(search, "i") };
    }
    const skip = (page - 1) * limit;

    // Date
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    const products = await Product.find(filter, {
      attributes: 0,
      moreImageURL: 0,
    })
      .skip(skip)
      .limit(limit)
      .populate("category", { name: 1 });

    const totalAvailableProducts = await Product.countDocuments(filter);

    res.status(200).json({ products, totalAvailableProducts });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch products. Please try again." });
  }
};

// Get single Product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch product. Please try again." });
  }
};

// Creating new Product
const addProduct = async (req, res) => {
  try {
    let formData = { ...req.body, isActive: true };
    // Ensure longDescription is present (for new/old forms)
    if (typeof formData.longDescription === 'undefined') {
      formData.longDescription = '';
    }
    const files = req?.files;

    let attributes = [];
    try {
      attributes = JSON.parse(formData.attributes || "[]");
    } catch (e) {
      return res.status(400).json({ error: "Invalid attributes format. Please check your product options." });
    }
    formData.attributes = attributes;

    if (typeof formData.faqs === "string" && formData.faqs.trim() !== "") {
      try {
        const parsedFaqs = JSON.parse(formData.faqs);
        if (Array.isArray(parsedFaqs)) {
          formData.faqs = parsedFaqs
            .map((f) => ({
              question: (f?.question || "").toString().trim(),
              answer: (f?.answer || "").toString().trim(),
            }))
            .filter((f) => f.question && f.answer);
        } else {
          delete formData.faqs;
        }
      } catch (e) {
        delete formData.faqs;
      }
    }

    if (files && files.length > 0) {
      formData.moreImageURL = [];
      formData.imageURL = "";
      
      files.forEach((file) => {
        const fileRef = file.path || file.filename;
        if (file.fieldname === "imageURL") {
          formData.imageURL = fileRef;
        } else if (file.fieldname === "moreImageURL") {
          formData.moreImageURL.push(fileRef);
        }
      });
      
      // If no explicit thumbnail (imageURL) was provided, use the first image as thumbnail
      if (!formData.imageURL && formData.moreImageURL.length > 0) {
        formData.imageURL = formData.moreImageURL[0];
      }
    }

    // Validate all fields before saving
    const validationErrors = validateProductFields(formData, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(". ") });
    }

    // Derive offer from strike price (markup) and price if possible
    if (formData.price !== undefined && formData.markup !== undefined) {
      const p = Number(formData.price);
      const m = Number(formData.markup);
      if (!isNaN(p) && !isNaN(m) && m > 0) {
        formData.offer = Math.max(0, Math.round(((m - p) / m) * 100));
      } else {
        formData.offer = 0;
      }
    }

    const product = await Product.create(formData);

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: formatValidationError(error) });
  }
};

// Update a Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;
    // Ensure longDescription is present (for new/old forms)
    if (typeof formData.longDescription === 'undefined') {
      formData.longDescription = '';
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const files = req?.files;

    // Retrieve the existing product from the database
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (files && files.length > 0) {
      // Initialize arrays for new images
      let newMoreImageURL = [...existingProduct.moreImageURL]; // Start with existing images
      let newImageURL = existingProduct.imageURL; // Keep existing thumbnail

      files.map((file) => {
        const fileRef = file.path || file.filename;
        if (file.fieldname === "imageURL") {
          // Update the thumbnail image only if a new one is provided
          newImageURL = fileRef;
        } else {
          // Append new images to the existing array
          newMoreImageURL.push(fileRef);
        }
      });

      // Set the new values in formData
      formData.imageURL = newImageURL;
      formData.moreImageURL = newMoreImageURL;
    }

    // Handle deletion of images
    if (formData.imagesToDelete) {
      try {
        const imagesToDelete = JSON.parse(formData.imagesToDelete);
        formData.moreImageURL = (formData.moreImageURL || existingProduct.moreImageURL).filter(
          (img) => !imagesToDelete.includes(img)
        );
      } catch (e) {
        return res.status(400).json({ error: "Invalid image deletion data format" });
      }
    }

    if (formData.attributes) {
      try {
        const attributes = JSON.parse(formData.attributes);
        formData.attributes = attributes;
      } catch (e) {
        return res.status(400).json({ error: "Invalid attributes format. Please check your product options." });
      }
    }

    if (typeof formData.faqs === "string" && formData.faqs.trim() !== "") {
      try {
        const parsedFaqs = JSON.parse(formData.faqs);
        if (Array.isArray(parsedFaqs)) {
          formData.faqs = parsedFaqs
            .map((f) => ({
              question: (f?.question || "").toString().trim(),
              answer: (f?.answer || "").toString().trim(),
            }))
            .filter((f) => f.question && f.answer);
        } else {
          delete formData.faqs;
        }
      } catch (e) {
        delete formData.faqs;
      }
    }

    // Validate fields before updating
    const validationErrors = validateProductFields(formData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(". ") });
    }

    // Derive offer when price/markup are present in update
    if (formData.price !== undefined || formData.markup !== undefined) {
      const p = formData.price !== undefined ? Number(formData.price) : Number(existingProduct.price);
      const m = formData.markup !== undefined ? Number(formData.markup) : Number(existingProduct.markup);
      if (!isNaN(p) && !isNaN(m) && m > 0) {
        formData.offer = Math.max(0, Math.round(((m - p) / m) * 100));
      } else {
        formData.offer = 0;
      }
    }

    // Update the product in the database
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: { ...formData } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: formatValidationError(error) });
  }
};

// Update a Product
const updateProductManager = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    if (!formData.attrname || !formData.attrvalue) {
      return res.status(400).json({ error: "Attribute name and value are required" });
    }

    if (formData.attrquantity === undefined || isNaN(Number(formData.attrquantity))) {
      return res.status(400).json({ error: "Please provide a valid quantity for the attribute" });
    }

    if (Number(formData.attrquantity) < 0) {
      return res.status(400).json({ error: "Attribute quantity cannot be negative" });
    }

    const product = await Product.findOneAndUpdate(
      { 
        _id: id,
        "attributes.name": req.body.attrname,
        "attributes.value": req.body.attrvalue
      },
      { 
        $set: { 
          ...formData,
          "attributes.$.quantity": Number(req.body.attrquantity) 
        }
      },
      { 
        new: true 
      }
    );

    if (!product) {
      return res.status(404).json({ error: "Product or attribute not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: formatValidationError(error) });
  }
};

// Deleting a Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findOneAndDelete({ _id: id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: formatValidationError(error) });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  updateProductManager
};
