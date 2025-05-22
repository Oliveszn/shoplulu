const express = require("express");

const { addProduct } = require("../controllers/products_controller");
const { checkAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/add", checkAdmin, addProduct);

module.exports = router;
