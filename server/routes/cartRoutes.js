const express = require("express");
const {
  addToUserCart,
  addToGuestCart,
  validateProducts,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
  fetchGuestCart,
  updateGuestCartItemQty,
  deleteGuestCartItem,
} = require("../controllers/cart_controller");
const { authMiddleware } = require("../controllers/auth_controller");

const router = express.Router();

///for guests
router.post("/guest/add", validateProducts, addToGuestCart);
router.get("/guest/:guestId", fetchGuestCart);
router.put("/guest/update-cart", validateProducts, updateGuestCartItemQty);
router.delete("/guest/delete", deleteGuestCartItem);

// for auth users
router.post("/user/add", authMiddleware, validateProducts, addToUserCart);
router.get("/user/get", authMiddleware, fetchCartItems);
router.put(
  "/user/update-cart",
  authMiddleware,
  validateProducts,
  updateCartItemQty
);
router.delete("/user/delete", authMiddleware, deleteCartItem);

module.exports = router;
