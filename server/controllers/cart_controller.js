const db = require("../db");

db.query("SELECT NOW()")
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));
//middleware
const validateProducts = async (req, res, next) => {
  const { productId, quantity } = req.body;
  // to validate the product in the request
  if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    const product = await db.query(
      "SELECT product_id, stock FROM products WHERE product_id = $1",
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (quantity > product.rows[0].stock) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    req.product = product.rows[0]; // Attach product info for later use
    next();
  } catch (error) {
    console.error("Validation error:", err);
    res.status(500).json({ error: "Product validation failed" });
  }
};

// For guests
const guestCarts = new Map();
const addToGuestCart = async (req, res) => {
  const { productId, quantity, guestId } = req.body;

  try {
    const newGuestId =
      guestId || `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Get or create guest cart
    let cart = guestCarts.get(guestId) || { items: [] };

    // Find existing item
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    guestCarts.set(newGuestId, cart);
    return res.json({
      guestId: newGuestId,
      // items: [{ productId, quantity }],
      items: cart.items,
      message: "Item added to guest cart",
    });
  } catch (error) {
    console.error("Guest cart error:", error);
    return res.status(500).json({ error: "Failed to update guest cart" });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;

  try {
    // Authenticated user: Handle cart in database
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // 1. Get or create user's cart
      const cartRes = await client.query(
        `WITH new_cart AS (
         INSERT INTO carts (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
         RETURNING cart_id
       )
       SELECT cart_id FROM new_cart
       UNION
       SELECT cart_id FROM carts WHERE user_id = $1`,
        [userId]
      );

      if (!cartRes.rows[0]) throw new Error("Failed to get/create cart");
      const cartId = cartRes.rows[0].cart_id;

      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist
        cart.items.push({ productId, quantity });
      }

      // 2. Merge guest cart if provided
      if (guestId) {
        const guestItems = req.body.guestItems || [];
        for (const item of guestItems) {
          await client.query(
            `
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET 
              quantity = cart_items.quantity + EXCLUDED.quantity,
              updated_at = NOW()
          `,
            [cartId, item.productId, item.quantity]
          );
        }
      }

      // 3. Add current item
      await client.query(
        `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET 
          quantity = cart_items.quantity + EXCLUDED.quantity,
          updated_at = NOW()
      `,
        [cartId, productId, quantity]
      );

      // 4. Get updated cart
      const { rows: items } = await client.query(
        `
        SELECT product_id, quantity
        FROM cart_items 
        WHERE cart_id = $1
      `,
        [cartId]
      );

      await client.query("COMMIT");

      return res.json({
        userId,
        items: items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),
        message: "Item added to cart",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Cart error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to add to cart" });
  }
};

module.exports = { addToCart, addToGuestCart, validateProducts };
