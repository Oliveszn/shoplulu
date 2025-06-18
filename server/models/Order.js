const db = require("../db");

const orders = {
  // Find all addresses for a user
  async findByUserId(userId) {
    const query =
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC";
    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  ///find the id of an order(getting the order details)
  async findById(id) {
    const query = "SELECT * FROM orders WHERE id = $1";
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },
};

module.exports = orders;
