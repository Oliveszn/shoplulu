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

// Get all addresses for user
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await address.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching address:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
    });
  }
};

///delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: addressId } = req.params;
    const addresses = await address.findByUserId(userId);

    if (!addresses) {
      return res.status(404).json({
        success: false,
        message: "address not found",
      });
    }

    const deletedAddress = await address.deleteAddress(userId, addressId);
    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "failed to delete address",
      });
    }
    res.status(200).json({
      success: true,
      message: "Address deleted succesful",
      data: deletedAddress,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "error occured",
    });
  }
};

//edit address
const editAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: addressId } = req.params;
    const updateData = req.body;
    const selectAddress = await address.findByAddressId(addressId, userId);

    // Validate required fields
    if (!addressId || !updateData) {
      return res.status(400).json({
        success: false,
        message: "Missing address ID or update data",
      });
    }

    if (!selectAddress) {
      return res.status(404).json({
        success: false,
        message: "No address found",
      });
    }

    const updateAddress = await address.update(userId, addressId, updateData);
    if (!updateAddress) {
      return res.status(404).json({
        success: false,
        message: "Failed to update address",
      });
    }
    res.status(200).json({
      success: true,
      data: updateAddress,
      message: "address updated successfully",
    });
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating address",
    });
  }
};

//change default address
const defaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: addressId } = req.params;
    // Validate required fields
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Address",
      });
    }

    const updateDefault = await address.setDefault(userId, addressId);
    if (!updateDefault) {
      return res.status(404).json({
        success: false,
        message: "Address not found or update failed",
      });
    }

    res.status(200).json({
      success: true,
      data: updateDefault,
      message: "Default address updated.",
    });
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating address",
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  deleteAddress,
  editAddress,
  defaultAddress,
};
