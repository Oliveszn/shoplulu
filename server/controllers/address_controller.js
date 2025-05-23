const address = require("../models/Address");
const db = require("../db");

const addAddress = async (req, res) => {
  try {
    // Get user ID from authenticated user
    // const userId = req.user.id;
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to add an address",
      });
    }

    const {
      address_line1,
      city,
      state,
      postal_code,
      phone,
      phone_2,
      notes,
      is_default,
    } = req.body;

    //validate inputs
    if (!address_line1 || !city || !state || !phone) {
      return res.status(400).json({
        success: false,
        message: "missing required fields",
      });
    }
    const newAddress = await address.create({
      user_id: req.user.id,
      address_line1,
      city,
      state,
      postal_code,
      phone,
      phone_2,
      notes,
      is_default,
    });

    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error("address error", error.message);
    res.status(500).json({
      success: false,
      message: "error occured",
    });
  }
};

module.exports = { addAddress };
