const Product = require("../../model/productModel");
const Enquiry = require("../../model/enquiryModel");
const mongoose = require("mongoose");
const { sendManagerNoti,sendEnquiryWhtspMsg, sendEnquiryMail } = require("../../util/mailFunction");
const User = require("../../model/userModel");

const notify = (req, res) => {
  console.log("manager notified");
  const { id } = req.params;

  console.log(id);
  res.status(200).json(" Test");
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

// Get single Product
const getEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const product = await Enquiry.findOne({ _id: id });

    if (!product) {
      throw Error("No Such Product");
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Deleting a Product
const deleteEnquiry = async (req, res) => {
  try {
    console.log("deleting");

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const product = await Enquiry.findOneAndDelete({ _id: id });

    if (!product) {
      throw Error("No Such Product");
    }

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


    // Retrieve the existing product from the database
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw Error("No Such Product");
    }

    // Update the product in the database
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: { ...formData } },
      { new: true }
    );

    if (!product) {
      throw Error("No Such Product");
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Getting all products to list on admin dashboard
const getNotifiers = async (req, res) => {
  try {
    console.log('calling.. ');

    const {
      status,
      search,
      page = 1,
      limit = 10,
      startingDate,
      endingDate,
    } = req.query;
    console.log(req.query);


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

    const products = await Enquiry.find(filter, {
      attributes: 0,
      moreImageURL: 0,
    })
      .skip(skip)
      .limit(limit)
      .populate("category", { name: 1 });
    console.log(products);

    const totalAvailableProducts = await Enquiry.countDocuments(filter);
    console.log(totalAvailableProducts);

    res.status(200).json({ products, totalAvailableProducts });
  } catch (error) {
    console.log("error");
    console.log(error);

    res.status(400).json({ error: error.message });
  }
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
    res.status(400).json({ error: error.message });
  }
};


// Handle enquiries
const addEnquiry = async (req, res) => {
  try {
    const { productid, name, value } = req.params; // Get product ID from request parameters
    console.log("params :", productid, name, value);

    // Find the product by its ID
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const existingEnquiry = await Enquiry.findOne({
      productId: product._id,
      enqattname: name, // Check if enqattname matches the 'name' from request
      enqattvalue: value // Check if enqattvalue matches the 'value' from request
    });
    if (existingEnquiry) {
      return res.status(200).json({ message: "Enquiry added successfully", enquiry: true });
    }

    // Prepare data for the Enquiry collection
    const enquiryData = {
      productId: product._id,
      name: product.name,
      description: product.description,
      stockQuantity: product.stockQuantity,
      category: product.category,
      imageURL: product.imageURL,
      price: product.price,
      markup: product.markup,
      status: product.status,
      attributes: product.attributes,
      moreImageURL: product.moreImageURL,
      isActive: product.isActive,
      rating: product.rating,
      numberOfReviews: product.numberOfReviews,
      offer: product.offer,
      enquiryDate: new Date(), // Add enquiry date
      enquiryStatus: "pending", // Default status for the enquiry
      customerDetails: req.body.customerDetails || {}, // Optional customer details from the request
      enqattname: name,
      enqattvalue: value,
    };

    // Insert into the Enquiries collection
    const enquiry = await Enquiry.create(enquiryData);
    console.log("email sending process 1");


    const customers = await User.find(
      { role: "manager" },
      {
        password: 0,
        dateOfBirth: 0,
        role: 0,
        walletBalance: 0,
        isEmailVerified: 0,
      }
    )
      .sort({ createdAt: -1 });

    // Extracting emails
    const emails = customers.map(customer => customer.email);

    console.log("email sending process");
    // Sending notifications
    // if (emails.length > 0) {
    //   for (const email of emails) {
    //     console.log("email");
    //     console.log(email);

        // await sendEnquiryMail(email, enquiry);
        await sendEnquiryWhtspMsg("email", enquiry);
    //   }
    // }
    res.status(200).json({ message: "Enquiry added successfully", enquiry });


  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  notify, getProduct, updateProduct, getNotifiers, addEnquiry, getProducts, getEnquiry, deleteEnquiry
};
