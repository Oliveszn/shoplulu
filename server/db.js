// db.js
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "auth_lulu",
  password: "Kardashian1", // Same as pgAdmin login
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
