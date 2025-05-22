const Products = require("../models/Products");

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      image_url,
      image__url,
      price,
      stock_quantity,
      category,
      sub_category,
    } = req.body;

    // Validate input
    if (!name || !price || !stock_quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newlyCreatedProduct = await Products.create({
      name,
      image_url,
      image__url,
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

module.exports = { addProduct };
