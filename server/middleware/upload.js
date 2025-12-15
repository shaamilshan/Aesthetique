const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Use memory storage so we can optionally upload to Cloudinary ourselves.
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

// If Cloudinary is configured, connect
let cloudinary;
const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to upload a buffer to Cloudinary and return the secure_url
function uploadBufferToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER || "aesthetique/products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

// Export a middleware that first runs multer to populate req.files,
// then (if Cloudinary is enabled) uploads each file and sets file.path to the secure URL.
const upload = (req, res, next) => {
  uploadMiddleware.any()(req, res, async (err) => {
    if (err) return next(err);

    // If no files or Cloudinary not configured, ensure local disk storage behavior
    if (!req.files || req.files.length === 0) return next();

    if (!useCloudinary) {
      // Write buffers to disk (preserve original behavior but using memoryStorage)
      try {
        req.files.forEach((file) => {
          const filename = `${Date.now()}-${file.originalname}`;
          const outPath = path.join(process.cwd(), "server", "public", "products", filename);
          // Ensure directory exists
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, file.buffer);
          // mimic multer disk storage fields
          file.filename = filename;
        });
        return next();
      } catch (e) {
        return next(e);
      }
    }

    // Cloudinary path: upload each file buffer and set file.path to secure_url
    try {
      for (let i = 0; i < req.files.length; i++) {
        const f = req.files[i];
        const result = await uploadBufferToCloudinary(f.buffer, f.mimetype);
        // Attach path (URL) and keep original filename for fallback
        f.path = result.secure_url;
        f.filename = path.basename(result.public_id || result.secure_url);
      }
      next();
    } catch (e) {
      next(e);
    }
  });
};

module.exports = upload;
