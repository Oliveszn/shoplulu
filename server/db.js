require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};

if (NODE_ENV !== production) {
  (async () => {
    try {
      const res = await pool.query("SELECT NOW()");
      console.log("✅ Database connected successfully:", res.rows[0]);
    } catch (err) {
      console.error("❌ Database connection failed:", err.message);
    }
  })();
}

// CREATE TABLE addresses (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   address_line1 VARCHAR(255) NOT NULL,
//   city VARCHAR(100) NOT NULL,
//   state VARCHAR(100),
//   postal_code VARCHAR(20) NOT NULL,
//   phone VARCHAR(20) NOT NULL,
//   phone_2 VARCHAR(20),
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

// CREATE TABLE orders (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     cart_id INTEGER REFERENCES carts(cart_id),

//    address_id INTEGER REFERENCES address(id),

//     -- Order details
//     order_status VARCHAR(20) NOT NULL DEFAULT 'processing'
//     CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
//     payment_method VARCHAR(20) NOT NULL
//     CHECK (payment_method IN ('paypal', 'card', 'bank_transfer')),
//     payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
//     CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
//     total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
//     order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//     order_update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//     payment_id VARCHAR(255),
//     payer_id VARCHAR(255),

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE order_items (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
//   product_id BIGINT NOT NULL REFERENCES products(product_id),
//   name VARCHAR(255) NOT NULL,
//   images VARCHAR(255),
//   price DECIMAL(10,2) NOT NULL,
//   quantity INTEGER NOT NULL CHECK (quantity > 0)
// );

// CREATE TABLE order_addresses (
//   order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
//   address_line1 TEXT NOT NULL,
//   city TEXT NOT NULL,
//   state TEXT NOT NULL,
//   postal_code TEXT NOT NULL,
//   phone TEXT NOT NULL,
//   phone_2 TEXT,
//   notes TEXT
// );
