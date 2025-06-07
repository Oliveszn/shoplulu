const express = require("express");
const { addToCart } = require("../controllers/cart_controller");
const { authMiddleware } = require("../controllers/auth_controller");

const router = express.Router();

// Middleware to attach userId (optional, for guests)
router.post("/add", authMiddleware, addToCart);

module.exports = router;
