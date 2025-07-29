const express = require("express");

const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getProductDetails,
  getFilteredProducts,
} = require("../controllers/products_controller");
const { checkAdmin } = require("../middleware/auth");
const { upload } = require("../helpers/cloudinary");
const { authMiddleware } = require("../controllers/auth_controller");
const router = express.Router();

// For multiple images
router.post("/upload", upload.array("images", 5), handleImageUpload);
// 'images' is the field name, 5 is max number of files

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", authMiddleware, checkAdmin, addProduct);
router.get("/get", fetchAllProducts);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

//for users
router.get("/filter", getFilteredProducts);
router.get("/:id", getProductDetails);

module.exports = router;
