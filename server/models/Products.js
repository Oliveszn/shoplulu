const db = require("../db");

const Product = {
  async create({
    name,
    image_url,
    image__url,
    price,
    stock_quantity,
    category,
    sub_category,
  }) {
    // Validate required fields
    if (!name || !price || !stock_quantity) {
      throw new Error("Missing required fields (name, price, stock_quantity)");
    }

    // const query = await db.query(
    //   `INSERT INTO Products (name, image_url, image__url, price, stock_quantity, category, sub_category)
    //         VALUES ($1, $2, $3, $4, $5, $6, $7)
    //         RETURNING id, name, image_url, image__url, price, stock_quantity, category, sub_category, created_at`,
    const query = `
    INSERT INTO products (name, image_url, image__url, price, stock_quantity, category, sub_category) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING product_id AS id, name, image_url, image__url, price, stock_quantity, category, sub_category, created_at
  `;
    //   [
    //     name,
    //     image_url,
    //     image__url,
    //     price,
    //     stock_quantity,
    //     category,
    //     sub_category,
    //   ]
    // );
    const values = [
      name,
      image_url,
      image__url,
      price,
      stock_quantity,
      category,
      sub_category,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = Product;
