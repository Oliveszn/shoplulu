const Products = require("../models/Products");
const db = require("../db");
const {
  imageUploadUtils,
  uploadMultipleImages,
} = require("../helpers/cloudinary");
/////for admin////

//handle image upload
const handleImageUpload = async (req, res) => {
  // try {
  //   const b64 = Buffer.from(req.file.buffer).toString("base64");
  //   const url = "data:" + req.file.mimetype + ";base64," + b64;
  //   const result = await imageUploadUtils(url);

  //   res.json({
  //     success: true,
  //     result,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.json({
  //     success: false,
  //     message: "error occured",
  //   });
  // }

  try {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Upload all images
    const results = await uploadMultipleImages(req.files);

    // Extract URLs
    const urls = results.map((result) => result.secure_url);

    res.json({
      success: true,
      urls, // Return array of URLs
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred during upload",
      error: error.message,
    });
  }
};
//add a new product
const addProduct = async (req, res) => {
  try {
    const { name, images, price, stock_quantity, category, sub_category } =
      req.body;

    // Validate input
    if (!name || !price || !stock_quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newlyCreatedProduct = await Products.create({
      name,
      images,
      price,
      stock_quantity,
      category,
      sub_category,
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.error("error in product:", error.message);
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
