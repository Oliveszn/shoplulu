const db = require("../db");

const address = {
  async create({
    userId,
    addressLine1,
    city,
    state,
    postalCode,
    phone,
    phone2,
    notes,
    isDefault,
  }) {
    // Validate required fields
    if (!addressLine1 || !city || !state || !phone) {
      throw new Error("Missing required fields ");
    }

    const query = `
      INSERT INTO addresses (userId, addressLine1, city, state, postalCode, phone, phone2, notes, isDefault)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userId,
      addressLine1,
      city,
      state,
      postalCode,
      phone,
      phone2 || null,
      notes,
      isDefault || null,
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  },
};
