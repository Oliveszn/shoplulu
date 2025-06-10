// db.js
require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD, // Same as pgAdmin login
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};

// CREATE TABLE addresses (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   address_line1 VARCHAR(255) NOT NULL,
//   address_line2 VARCHAR(255),
//   city VARCHAR(100) NOT NULL,
//   state VARCHAR(100),
//   postal_code VARCHAR(20) NOT NULL,
//   country VARCHAR(100) DEFAULT 'Nigeria',
//   phone VARCHAR(20) NOT NULL,
//   notes TEXT,
//   is_default BOOLEAN DEFAULT false,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// CREATE TABLE carts (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// CREATE TABLE cart_items (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
//   product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
//   quantity INTEGER NOT NULL CHECK (quantity >= 1),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

// This will:
// Create a unique constraint named unique_cart_product
// Prevent the same product from being added multiple times to the same cart
// Allow the same product to exist in different carts (different cart_ids)
// ALTER TABLE cart_items
// ADD CONSTRAINT unique_cart_product
// UNIQUE (cart_id, product_id);
// );
