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

// Helper that creates a middleware from a multer handler (single/any/array)
function createHandler(multerHandler) {
  return (req, res, next) => {
    multerHandler(req, res, async (err) => {
      if (err) return next(err);

      // Normalize multer output: single -> req.file, fields -> req.files as object
      if (req.file && !req.files) {
        req.files = [req.file];
      }
      if (req.files && !Array.isArray(req.files) && typeof req.files === 'object') {
        // multer.fields returns { fieldname: [files] }
        req.files = Object.values(req.files).flat();
      }

      if (!req.files || req.files.length === 0) return next();

      if (!useCloudinary) {
        // Write buffers to disk (preserve original behavior but using memoryStorage)
        try {
          req.files.forEach((file) => {
            const filename = `${Date.now()}-${file.originalname}`;
            // Ensure files are written to the server's public/products directory
            const outDir = path.join(__dirname, "..", "public", "products");
            const outPath = path.join(outDir, filename);
            // Ensure directory exists
            fs.mkdirSync(outDir, { recursive: true });
            fs.writeFileSync(outPath, file.buffer);
            // mimic multer disk storage fields
            file.filename = filename;
          });
          return next();
        } catch (e) {
          return next(e);
        }
      }

      // Cloudinary path: upload each file buffer and set file.path to the secure URL
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
}

// Export an object that mimics the common multer API used across the codebase
const upload = {
  any: () => createHandler(uploadMiddleware.any()),
  single: (field) => createHandler(uploadMiddleware.single(field)),
  array: (field, maxCount) => createHandler(uploadMiddleware.array(field, maxCount)),
  fields: (fields) => createHandler(uploadMiddleware.fields(fields)),
};

module.exports = upload;
