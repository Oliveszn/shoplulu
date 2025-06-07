const db = require("../db");

// Helper function to validate product and stock
const validateProduct = async (productId, quantity) => {
  const productRes = await pool.query(
    "SELECT price, stock FROM products WHERE product_id = $1",
    [productId]
  );
  if (productRes.rows.length === 0) {
    throw new Error("Product not found");
  }
  const { price, stock } = productRes.rows[0];
  if (quantity > stock) {
    throw new Error("Insufficient stock");
  }
  return price;
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.userId; // From auth middleware (e.g., JWT)
  const guestCart = req.body.guestCart; // Guest cart from frontend (optional)

  // Validate inputs
  if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    if (!userId) {
      // Guest: Handle cart in memory (to be stored in localStorage by frontend)
      const guestId =
        guestCart?.guestId ||
        `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const cart = guestCart || { guestId, items: [] };

      // Validate product
      const price = await validateProduct(productId, quantity);

      // Update or add item
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price });
      }

      return res.json({ cart, message: "Item added to guest cart" });
    }

    // Authenticated user: Handle cart in database
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // Validate product
      const price = await validateProduct(productId, quantity);

      // Get or create cart
      let cartRes = await client.query(
        `INSERT INTO carts (user_id, created_at, updated_at)
         VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id) DO NOTHING
         RETURNING cart_id`,
        [userId]
      );
      let cartId = cartRes.rows[0]?.cart_id;
      if (!cartId) {
        const existingCart = await client.query(
          "SELECT cart_id FROM carts WHERE user_id = $1",
          [userId]
        );
        cartId = existingCart.rows[0].cart_id;
      }

      // Add or update item
      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price, created_at, updated_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (cart_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
                       updated_at = CURRENT_TIMESTAMP`,
        [cartId, productId, quantity, price]
      );

      // Fetch updated cart
      const updatedCartRes = await client.query(
        `SELECT ci.product_id, ci.quantity, ci.price
         FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.cart_id
         WHERE c.user_id = $1`,
        [userId]
      );

      await client.query("COMMIT");

      // Format cart for response and localStorage
      const cart = {
        userId,
        items: updatedCartRes.rows.map((row) => ({
          productId: row.product_id,
          quantity: row.quantity,
          price: parseFloat(row.price),
        })),
      };

      return res.json({ cart, message: "Item added to user cart" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to add to cart" });
  }
};

module.exports = { addToCart };
