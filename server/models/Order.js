const db = require("../db");

const orders = {
  // Find all orders for a user
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

  ////find all orders for admin
  async findAll() {
    const query = "SELECT * FROM orders;";
    const { rows } = await db.query(query);
    return rows;
  },

  // changing order status for a user
  async setOrderStatus(id, newStatus) {
    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid order status");
    }
    const query =
      "UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *";
    const { rows } = await db.query(query, [newStatus, id]);
    return rows[0];
  },
};

module.exports = orders;
