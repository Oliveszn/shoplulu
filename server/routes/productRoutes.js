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
const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", checkAdmin, addProduct);
router.get("/get", fetchAllProducts);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

//for users
router.get("/:id", getProductDetails);
router.get("/", getFilteredProducts);

module.exports = router;
