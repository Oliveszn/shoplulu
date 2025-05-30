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
  const uploadPromises = files.map((file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    return cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
  });

  return Promise.all(uploadPromises);
};

const imageUploadUtils = async (file) => {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 files
  },
});

module.exports = { upload, imageUploadUtils, uploadMultipleImages };
