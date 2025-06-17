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
      is_default || false,
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Find all addresses for a user
  async findByUserId(userId) {
    const query =
      "SELECT * FROM address WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC";
    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  //delete address
  async deleteAddress(userId, addressId) {
    const query =
      "DELETE from address WHERE id = $1 AND user_id = $2 RETURNING *";
    const { rows } = await db.query(query, [addressId, userId]);
    return rows[0];
  },

  async findByAddressId(addressId, userId) {
    const query = "SELECT * FROM address WHERE id = $1 AND user_id = $2";
    const { rows } = await db.query(query, [addressId, userId]);
    return rows[0];
  },

  ///update/edit address
  async update(userId, addressId, updateData) {
    const query = `
      UPDATE address 
      SET 
          address_line1 = COALESCE($1, address_line1),
      city = COALESCE($2, city),
      state = COALESCE($3, state),
      postal_code = COALESCE($4, postal_code),
      phone = COALESCE($5, phone),
      phone_2 = COALESCE($6, phone_2),
      notes = COALESCE($7, notes),
      is_default = COALESCE($8, is_default)
        WHERE id = $9 AND user_id = $10
      RETURNING *
    `;
    // COALESCE is a PostgreSQL function that returns the first non-null value from a list of arguments. It's often used to provide fallback/default values when dealing with potentially NULL data.
    const values = [
      updateData.address_line1,
      updateData.city,
      updateData.state,
      updateData.postal_code,
      updateData.phone,
      updateData.phone_2,
      updateData.notes,
      updateData.is_default || false,
      addressId,
      userId,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Set default address for a user
  async setDefault(userId, addressId) {
    // First reset any existing default
    await db.query("UPDATE address SET is_default = false WHERE user_id = $1", [
      userId,
    ]);

    // Set new default
    const query =
      "UPDATE address SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *";
    const { rows } = await db.query(query, [addressId, userId]);
    return rows[0];
  },
};

module.exports = address;
