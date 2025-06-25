const express = require("express");

const {
  createOrderWithPayPal,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  getAllOrdersOfAllUsers,
  updateOrderStatus,
} = require("../controllers/order_controller");
const { authMiddleware } = require("../controllers/auth_controller");
const { checkAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/create", authMiddleware, createOrderWithPayPal);
router.post("/capture", authMiddleware, capturePayment);
router.get("/list", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

//for admin
router.get("/get", authMiddleware, checkAdmin, getAllOrdersOfAllUsers);
router.put("/status/:id", authMiddleware, checkAdmin, updateOrderStatus);

module.exports = router;
