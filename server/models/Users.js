const db = require("../db");

const User = {
  async create({ username, email, password, role = "user" }) {
    const { rows } = await db.query(
      `INSERT INTO users (username, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role, created_at`,
      [username, email, password, role]
    );
    return rows[0];
  },

  async findByUsername(username) {
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  },

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },
};

module.exports = User;
