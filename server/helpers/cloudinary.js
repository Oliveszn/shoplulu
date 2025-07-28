const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

// Modified to handle multiple files
const uploadMultipleImages = async (files) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const uploadPromises = files.map(async (file, index) => {
    try {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "products", // Organize uploads in folders
        transformation: [
          { width: 1000, height: 1000, crop: "limit" }, // Resize large images
          { quality: "auto:best" }, // Auto quality optimization
          { format: "auto" }, // Auto format selection
        ],
        // Generate a unique filename
        public_id: `product_${Date.now()}_${index}`,
      });

      return result;
    } catch (uploadError) {
      throw new Error(
        `Upload failed for ${file.originalname}: ${uploadError.message}`
      );
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};

///this for single images
const imageUploadUtils = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "products",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto:best" },
        { format: "auto" },
      ],
    });
    return result;
  } catch (error) {
    console.error("Single image upload failed:", error);
    throw error;
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = { upload, imageUploadUtils, uploadMultipleImages };
