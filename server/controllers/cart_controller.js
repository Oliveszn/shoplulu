const db = require("../db");

// Helper function to validate product and stock
const validateProduct = async (productId, quantity) => {
  const productRes = await db.query(
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
  const userId = req.user?.id;
  const guestId = req.body.guestCart;

  // Validate inputs
  if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    if (!userId) {
      const newGuestId =
        guestId || `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      return res.json({
        guestId: newGuestId,
        items: [{ productId, quantity }],
        message: "Item added to guest cart",
      });
    }

    // Authenticated user: Handle cart in database
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // 1. Get or create user's cart
      const {
        rows: [cart],
      } = await client.query(
        `
        INSERT INTO carts (user_id) 
        VALUES ($1) 
        ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
        RETURNING cart_id
      `,
        [userId]
      );

      // 2. Merge guest cart if provided
      if (guestId) {
        const guestItems = req.body.guestItems || [];
        for (const item of guestItems) {
          await client.query(
            `
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (cart_id, product_id)
            DO UPDATE SET 
              quantity = cart_items.quantity + EXCLUDED.quantity,
              updated_at = NOW()
          `,
            [cart.cart_id, item.productId, item.quantity]
          );
        }
      }

      // 3. Add current item
      await client.query(
        `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET 
          quantity = cart_items.quantity + EXCLUDED.quantity,
          updated_at = NOW()
      `,
        [cart.cart_id, productId, quantity]
      );

      // 4. Get updated cart
      const { rows: items } = await client.query(
        `
        SELECT product_id, quantity
        FROM cart_items 
        WHERE cart_id = $1
      `,
        [cart.cart_id]
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

module.exports = { addToCart };

// "guestId": "guest_1749394006949_3quwhh8mk9u",
//     "items": [
//         {
//             "productId": 21,
//             "quantity": 2
//         }
//     ],
