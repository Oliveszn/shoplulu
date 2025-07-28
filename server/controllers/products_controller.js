const Products = require("../models/Products");
const db = require("../db");
const {
  imageUploadUtils,
  uploadMultipleImages,
} = require("../helpers/cloudinary");
/////for admin////

//handle image upload
const handleImageUpload = async (req, res) => {
  try {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    console.log(`Received ${req.files.length} files for upload`);

    // Validate file types
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const invalidFiles = req.files.filter(
      (file) => !validImageTypes.includes(file.mimetype)
    );

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid file types detected. Only JPEG, PNG, and WebP are allowed.`,
        invalidFiles: invalidFiles.map((f) => f.originalname),
      });
    }

    // Check file sizes (10MB limit per file)
    const oversizedFiles = req.files.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some files exceed the 10MB size limit",
        oversizedFiles: oversizedFiles.map((f) => f.originalname),
      });
    }

    // Upload all images
    const results = await uploadMultipleImages(req.files);

    // Validate upload results
    if (!results || results.length === 0) {
      throw new Error("No upload results received from Cloudinary");
    }

    // Extract URLs and additional info
    const uploadedImages = results.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      originalName: req.files[index].originalname,
      size: req.files[index].size,
    }));

    console.log(`Successfully uploaded ${uploadedImages.length} images`);

    res.json({
      success: true,
      urls: uploadedImages.map((img) => img.url), // For backward compatibility
      images: uploadedImages, // More detailed info
      count: uploadedImages.length,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle specific Cloudinary errors
    if (error.http_code) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary upload failed",
        error: error.message,
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error occurred during upload",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
//add a new product
const addProduct = async (req, res) => {
  try {
    const { name, images, price, stock, category, sub_category } = req.body;
    // Validate input
    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // this to ensure images is an array (handle empty arrays)
    const imageArray = Array.isArray(images) ? images : [];
    const newlyCreatedProduct = await Products.create({
      name,
      images: imageArray,
      price,
      stock,
      category,
      sub_category,
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const allProducts = await Products.findAll();

    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.error("error in product", error.message);
    res.status(500).json({
      success: false,
      message: "error occureed",
    });
  }
};

//edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await Products.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const updatedProduct = await Products.update(id, updateData);

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching product",
    });
  }
};

///delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    //check if the product exists
    const existingProduct = await Products.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    const deletedProduct = await Products.deleteById(id);
    res.status(200).json({
      success: true,
      message: " product delete succesful",
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "error occured",
    });
  }
};

/////for users
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    const { category = "all", sub_category = "all" } = req.query;

    // 2. Initialize base query and values
    let query = "SELECT * FROM products WHERE 1=1";
    const values = [];
    let valueCounter = 1;

    // 3. Handle category filter
    if (category !== "all") {
      const categories = category.split(",");
      query += ` AND category = ANY($${valueCounter++})`;
      values.push(categories);
    }

    // 4. Handle sub-category filter
    if (sub_category !== "all") {
      const subCategories = sub_category.split(",");
      query += ` AND sub_category = ANY($${valueCounter++})`;
      values.push(subCategories);
    }

    // 5. Execute query
    const { rows: products } = await db.query(query, values);

    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("filter error:", error.message);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getProductDetails,
  getFilteredProducts,
};
