require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Category = require('../model/categoryModel');
const Product = require('../model/productModel');

const ALL_FEATURES = [
  "dashboard",
  "products",
  "categories",
  "orders",
  "payments",
  "coupons",
  "users",
  "banners",
  "announcements",
  "faqs",
];

(async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    // 1. Seed Admin User
    const adminEmail = "admin@aesthetique.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log("Seeding admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("AdminPassword123", salt);

      const adminUser = await User.create({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: hashedPassword,
        phoneNumber: 9876543210,
        role: "superAdmin",
        isActive: true,
        isEmailVerified: true,
        permissions: ALL_FEATURES,
        isFirstLogin: false,
      });
      console.log(`Admin user seeded successfully with email: ${adminEmail} and password: AdminPassword123`);
    } else {
      console.log(`Admin user with email ${adminEmail} already exists.`);
    }

    // 2. Seed Categories
    console.log("Checking categories...");
    let skincareCategory = await Category.findOne({ name: "Skincare" });
    if (!skincareCategory) {
      skincareCategory = await Category.create({
        name: "Skincare",
        description: "Premium skincare products for healthy, glowing skin.",
        imgURL: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400",
        isActive: true
      });
      console.log("Created Skincare category.");
    }

    let fragranceCategory = await Category.findOne({ name: "Fragrance" });
    if (!fragranceCategory) {
      fragranceCategory = await Category.create({
        name: "Fragrance",
        description: "Luxury perfumes and scents.",
        imgURL: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400",
        isActive: true
      });
      console.log("Created Fragrance category.");
    }

    // 3. Seed Products
    console.log("Checking products...");
    const sampleProducts = [
      {
        name: "Hydrating Hyaluronic Serum",
        description: "Deep hydrating serum with multi-molecular hyaluronic acid.",
        longDescription: "Formulated with pure hyaluronic acid and Vitamin B5, this serum deeply hydrates the skin, plumps fine lines, and restores radiance.",
        stockQuantity: 50,
        category: skincareCategory._id,
        imageURL: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400",
        price: 1299,
        costPrice: 600,
        markup: 699,
        status: "published",
        isActive: true,
        rating: 4.8,
        numberOfReviews: 12
      },
      {
        name: "Vitamin C Brightening Cream",
        description: "Brightening moisturizer with stable Vitamin C and Ferulic Acid.",
        longDescription: "A powerful daily moisturizer containing Vitamin C, Vitamin E, and Ferulic Acid to brighten skin tone, reduce pigmentation, and protect against environmental stressors.",
        stockQuantity: 40,
        category: skincareCategory._id,
        imageURL: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=400",
        price: 1499,
        costPrice: 700,
        markup: 799,
        status: "published",
        isActive: true,
        rating: 4.6,
        numberOfReviews: 8
      },
      {
        name: "Elysian Eau de Parfum",
        description: "A sophisticated blend of floral and woody notes.",
        longDescription: "Elysian is a timeless scent combining top notes of bergamot and jasmine with a warm amber and cedarwood base. Perfect for day or night.",
        stockQuantity: 25,
        category: fragranceCategory._id,
        imageURL: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400",
        price: 3499,
        costPrice: 1500,
        markup: 1999,
        status: "published",
        isActive: true,
        rating: 4.9,
        numberOfReviews: 15
      }
    ];

    for (const prod of sampleProducts) {
      const existingProd = await Product.findOne({ name: prod.name });
      if (!existingProd) {
        await Product.create(prod);
        console.log(`Product "${prod.name}" seeded.`);
      } else {
        console.log(`Product "${prod.name}" already exists.`);
      }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  }
})();
