const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  //   capturePayment,
} = require("../controllers/order_controller");
const { authMiddleware } = require("../controllers/auth_controller");

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
// router.post("/capture", capturePayment);
router.get("/list", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
