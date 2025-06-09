const express = require("express");
const { addToCart } = require("../controllers/cart_controller");
const {
  authMiddleware,
  flexibleAuth,
} = require("../controllers/auth_controller");

const router = express.Router();

// Middleware to attach userId (optional, for guests)
router.post("/add", flexibleAuth, addToCart);

module.exports = router;
