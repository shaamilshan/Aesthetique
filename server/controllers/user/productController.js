const Product = require("../../model/productModel");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const { category, price, search, sort, page = 1, limit = 100 } = req.query;

    let filter = {};
    if (category) filter.category = { $in: category.split(",") };
    if (search) {
      // filter.name = { $regex: new RegExp(search, "i") };
      filter.name = { $regex: new RegExp(search.split('').join('.*'), 'i') };

    }
    if (price) {
      if (price === "Under 2500") {
        filter.price = { $lte: 2500 };
      }
      if (price === "2500-5000") {
        filter.price = { $gte: 2500, $lte: 5000 };
      }
      if (price === "5000-10000") {
        filter.price = { $gte: 5000, $lte: 10000 };
      }
      if (price === "10000-15000") {
        filter.price = { $gte: 10000, $lte: 15000 };
      }
      if (price === "20000-30000") {
        filter.price = { $gte: 20000, $lte: 30000 };
      }
      if (price === "Above 10000") {
        filter.price = { $gte: 10000 };
      }
    }

    let sortOptions = {};

    if (sort === "created-desc") {
      sortOptions.createdAt = 1;
    }

    if (sort === "price-asc") {
      sortOptions.price = 1;
    }
    if (sort === "price-desc") {
      sortOptions.price = -1;
    }
    if (!sort) {
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(
      {
        status: { $in: ["published", "low quantity","out of stock"] }, // edited here added out of stock , manageradding
        ...filter,
      },
      {
        name: 1,
        imageURL: 1,
        price: 1,
        markup: 1,
        numberOfReviews: 1,
        rating: 1,
        offer: 1,
      }
    )
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", { name: 1 });

    const totalAvailableProducts = await Product.countDocuments({
      status: { $in: ["published", "low quantity"] },
      ...filter,
    });

    res.status(200).json({ products, totalAvailableProducts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const product = await Product.findOne({ _id: id }).populate("category", {
      name: 1,
    });

    console.log(product);
    

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAvailableQuantity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const stockQuantity = await Product.findOne(
      { _id: id },
      { stockQuantity: 1 }
    );

    res.status(200).json({ stockQuantity: stockQuantity.stockQuantity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getAvailableQuantity,
};
