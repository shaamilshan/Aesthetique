require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./model/productModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);
    for (const p of products) {
      console.log(`- Name: ${p.name}, ID: ${p._id}, Price: ${p.price}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
