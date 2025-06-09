const express = require("express");
const {
  addToCart,
  addToGuestCart,
  validateProducts,
} = require("../controllers/cart_controller");
const {
  authMiddleware,
  flexibleAuth,
} = require("../controllers/auth_controller");

const router = express.Router();

///for guests
router.post("/guest/add", validateProducts, addToGuestCart);

// for auth users
router.post("/user/add", authMiddleware, validateProducts, addToCart);

module.exports = router;
