require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Add it back when communicating with react
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express();

// Mounting necessary middlewares.
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// Setting up cors

// const allowedOrigins = [process.env.CLIENT_URL,'https://hela-ecommerce.vercel.app'];
// const corsOptions = {
//   credentials: true,
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };
// app.use(cors(corsOptions));

// const corsOptions = {
//   origin: (origin, callback) => {
//     console.log("Origin: ", origin); // Debugging line
//     const allowedOrigins = ["https://helah.in", "https://www.helah.in"];
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   optionSuccessStatus: 200,
// };

const corsOptions = {
  // origin: ["https://trends-kart.vercel.app","https://trends-kart-production.vercel.app", "https://trends-kart.vercel.app"],
  origin: ["https://www.trendkartonline.com", "https://trendkartonline.com","https://trends-kart.vercel.app","https://trends-kart-production.vercel.app", "https://trends-kart.vercel.app","http://localhost:5173","https://ideal-lamp-74gr4wv97vv3p575-5173.app.github.dev"],
  // origin: process.env.CLIENT_URL,
  // origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
//
app.use(cors(corsOptions));

// Handling preflight requests manually
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS, PUT, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Origin, Authorization"
    );
    return res.status(200).json({});
  }
  next();
});

// Loading Routes
const userRoutes = require("./routes/user");
const managerRoutes = require("./routes/manager");
const adminRoutes = require("./routes/admin");
const superAdminRoutes = require("./routes/superAdmin");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");

// Auth middleware

const { requireAuth, requireAdminAuth } = require("./middleware/requireAuth");

// Mounting the routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/manager", managerRoutes);
// app.use("/api/admin", requireAdminAuth, adminRoutes);
// app.use("/api/super-admin", requireAdminAuth, superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/public", publicRoutes);

// Public Api for accessing images
app.use("/api/img", express.static(__dirname + "/public/products/"));
app.use("/api/off", express.static(__dirname + "/public/official/"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening on Port: ${process.env.PORT} - DB Connected`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
