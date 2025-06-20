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
  // async findById(id) {
  //   const query = "SELECT * FROM orders WHERE id = $1";
  //   const { rows } = await db.query(query, [id]);
  //   return rows[0];
  // },

  async findById(id) {
    const orderQuery = `
      SELECT 
        o.*,
        oa.address_line1, oa.city, oa.state, oa.postal_code, 
        oa.phone, oa.phone_2, oa.notes,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'name', oi.name,
            'images', oi.images,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) AS order_items
      FROM orders o
      LEFT JOIN order_addresses oa ON o.id = oa.order_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id, oa.address_line1, oa.city, oa.state, oa.postal_code, 
               oa.phone, oa.phone_2, oa.notes
    `;

    const { rows } = await db.query(orderQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

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
