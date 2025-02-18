const Product = require("../../model/productModel");
const mongoose = require("mongoose");

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
    res.status(400).json({ error: error.message });
  }
};

// Get single Product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const product = await Product.findOne({ _id: id });

    if (!product) {
      throw Error("No Such Product");
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Creating new Product
const addProduct = async (req, res) => {
  try {
    let formData = { ...req.body, isActive: true };
    const files = req?.files;

    const attributes = JSON.parse(formData.attributes);

    formData.attributes = attributes;

    if (files && files.length > 0) {
      formData.moreImageURL = [];
      formData.imageURL = "";
      files.map((file) => {
        if (file.fieldname === "imageURL") {
          formData.imageURL = file.filename;
        } else {
          formData.moreImageURL.push(file.filename);
        }
      });
    }

    const product = await Product.create(formData);

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;
    console.log("Updation: ", formData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const files = req?.files;

    // Retrieve the existing product from the database
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw Error("No Such Product");
    }

    if (files && files.length > 0) {
      // Initialize arrays for new images
      let newMoreImageURL = [...existingProduct.moreImageURL]; // Start with existing images
      let newImageURL = existingProduct.imageURL; // Keep existing thumbnail

      files.map((file) => {
        if (file.fieldname === "imageURL") {
          // Update the thumbnail image only if a new one is provided
          newImageURL = file.filename;
        } else {
          // Append new images to the existing array
          newMoreImageURL.push(file.filename);
        }
      });

      // Set the new values in formData
      formData.imageURL = newImageURL;
      formData.moreImageURL = newMoreImageURL;
    }

    // Handle deletion of images
    if (formData.imagesToDelete) {
      const imagesToDelete = JSON.parse(formData.imagesToDelete); // Expect this to be a JSON string from the frontend
      formData.moreImageURL = formData.moreImageURL.filter(
        (img) => !imagesToDelete.includes(img)
      );
    }

    if (formData.attributes) {
      const attributes = JSON.parse(formData.attributes);
      formData.attributes = attributes;
    }

    // Update the product in the database
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: { ...formData } },
      { new: true }
    );
    console.log(product);

    if (!product) {
      throw Error("No Such Product");
    }

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

// Update a Product
const updateProductManager = async (req, res) => {
  try {

    console.log("called manmager stoxck updayte");
    console.log(req.body);

    const { id } = req.params;
    const formData = req.body;
    console.log("Updation: ", formData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const product = await Product.findOneAndUpdate(
      { 
        _id: id,
        // Match the specific attribute
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

    // Update the product in the database
    // const product = await Product.findOneAndUpdate(
    //   { _id: id },
    //   { $set: { ...formData } },
    //   { new: true }
    // );
    console.log(product);

    if (!product) {
      throw Error("No Such Product");
    }

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};

// Deleting a Product
const deleteProduct = async (req, res) => {
  
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const product = await Product.findOneAndDelete({ _id: id });

    if (!product) {
      throw Error("No Such Product");
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
