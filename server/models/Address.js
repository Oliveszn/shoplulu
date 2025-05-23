const db = require("../db");

const address = {
  async create({
    user_id,
    address_line1,
    city,
    state,
    postal_code,
    phone,
    phone_2,
    notes,
    is_default,
  }) {
    // Validate required fields
    if (!address_line1 || !city || !state || !phone) {
      throw new Error("Missing required fields ");
    }

    const query = `
      INSERT INTO address (user_id, address_line1, city, state, postal_code, phone, phone_2, notes, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      user_id,
      address_line1,
      city,
      state,
      postal_code,
      phone,
      phone_2 || null,
      notes,
      is_default || null,
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

module.exports = address;
