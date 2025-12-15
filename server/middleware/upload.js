const multer = require("multer");

// Support Cloudinary storage when environment variables are provided.
// Fallback to local disk storage for development if Cloudinary is not configured.
let upload;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  // Use Cloudinary storage
  const cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      // Use a timestamp-based public_id to avoid collisions
      return {
        folder: process.env.CLOUDINARY_FOLDER || "aesthetique/products",
        format: file.mimetype.split("/")[1] || "jpg",
        public_id: `${Date.now()}`,
      };
    },
  });

  upload = multer({ storage });
} else {
  // Local disk fallback
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/products/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  upload = multer({ storage: storage });
}

module.exports = upload;
