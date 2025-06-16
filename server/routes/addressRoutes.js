const express = require("express");

const {
  addAddress,
  getAddresses,
  deleteAddress,
  editAddress,
} = require("../controllers/address_controller");
const { authMiddleware } = require("../controllers/auth_controller");
const router = express.Router();

router.post("/add", authMiddleware, addAddress);
router.get("/get", authMiddleware, getAddresses);
router.delete("/delete/:id", authMiddleware, deleteAddress);
router.put("/edit/:id", authMiddleware, editAddress);

module.exports = router;
