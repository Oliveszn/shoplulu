const db = require("../db");

const Products = {
  async create({
    name,
    images,
    price,
    stock_quantity,
    category,
    sub_category,
  }) {
    // Validate required fields
    if (!name || !price || !stock_quantity) {
      throw new Error("Missing required fields (name, price, stock_quantity)");
    }
    const query = `
    INSERT INTO products (name, images, price, stock_quantity, category, sub_category) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING product_id AS id, name, images, price, stock_quantity, category, sub_category, created_at
  `;
    const values = [
      name,
      images,

      price,
      stock_quantity,
      category,
      sub_category,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findAll() {
    const query = "SELECT * FROM products;";
    const { rows } = await db.query(query);
    return rows;
  },

  async findById(id) {
    const query = "SELECT * FROM products WHERE product_id = $1";
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async update(id, updateData) {
    const query = `
      UPDATE products 
      SET 
        name = $1,
        image_url = $2,
        image__url = $3,
        price = $4,
        stock_quantity = $5,
        category = $6,
        sub_category = $7
      WHERE product_id = $8
      RETURNING *
    `;
    const values = [
      updateData.name,
      updateData.images,
      updateData.price,
      updateData.stock_quantity,
      updateData.category,
      updateData.sub_category,
      id,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async deleteById(id) {
    const query = "DELETE FROM products WHERE product_id = $1 RETURNING *";
    const { rows } = await db.query(query, [id]);
    return rows[0]; // Returns the deleted product or undefined
  },
};

module.exports = Products;
