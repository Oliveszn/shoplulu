const express = require("express");

const { addAddress } = require("../controllers/address_controller");
const { authMiddleware } = require("../controllers/auth_controller");
const router = express.Router();

router.post("/", authMiddleware, addAddress);

module.exports = router;
