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
    console.error("Validation error:", error);
    res.status(500).json({ error: "Product validation failed" });
  }
};

// For guests
const guestCarts = new Map();
// Cleanup function to clear old guest cart after 24 hours
const cleanupGuestCarts = () => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [guestId, cart] of guestCarts.entries()) {
    const cartAge = now - parseInt(guestId.split("_")[1]);
    if (cartAge > maxAge) {
      guestCarts.delete(guestId);
    }
  }
  console.log("Guest carts cleaned up");
};

// this makes it run evry hour
setInterval(cleanupGuestCarts, 60 * 60 * 1000);

const addToGuestCart = async (req, res) => {
  const { productId, quantity, guestId } = req.body;

  try {
    const currentGuestId =
      guestId || `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Get or create guest cart
    let cart = guestCarts.get(currentGuestId) || { items: [] };

    // Find existing item
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update the quantity if exists else add a newone
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Store cart with the correct guestId
    guestCarts.set(currentGuestId, cart);

    return res.json({
      success: true,
      guestId: currentGuestId,
      items: cart.items,
      message: "Item added to guest cart",
    });
  } catch (error) {
    console.error("Guest cart error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update guest cart",
    });
  }
};

const autoMergeGuestCart = async (userId, guestId) => {
  let client;
  try {
    const guestCart = guestCarts.get(guestId);

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return { success: true, message: "No guest cart to merge" };
    }

    client = await db.connect();
    await client.query("BEGIN");

    // Get or create user's cart
    const cartRes = await client.query(
      `INSERT INTO carts (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
       RETURNING cart_id`,
      [userId]
    );

    const cartId = cartRes.rows[0].cart_id;

    // Merge guest cart items
    for (const guestItem of guestCart.items) {
      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (cart_id, product_id) 
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
        [cartId, guestItem.productId, guestItem.quantity]
      );
    }

    await client.query("COMMIT");

    // Clear guest cart
    guestCarts.delete(guestId);

    return { success: true, message: "Guest cart merged successfully" };
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Auto-merge cart error:", error);
    return { success: false, message: "Failed to merge guest cart" };
  } finally {
    if (client) {
      client.release();
    }
  }
};

const addToUserCart = async (req, res) => {
  let client;
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user not authenticated",
      });
    }

    // Authenticated user: Handle cart in database
    const client = await db.connect();
    await client.query("BEGIN");

    // 1. Get or create user's cart
    const cartRes = await client.query(
      `INSERT INTO carts (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
         RETURNING cart_id`,
      [userId]
    );

    const cartId = cartRes.rows[0].cart_id;

    // 2. Add or update cart item
    await client.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, productId, quantity]
    );

    // 3. Get updated cart items for response
    const itemsRes = await client.query(
      `SELECT product_id, quantity 
       FROM cart_items 
       WHERE cart_id = $1`,
      [cartId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      userId,
      items: itemsRes.rows.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
      message: "Item added to cart",
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Cart error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to add to cart",
    });
  } finally {
    if (client) client.release();
  }
};

const fetchCartItems = async (req, res) => {
  let client;
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    client = await db.connect();

    // Get cart with items and product details using JOIN
    const cartQuery = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.created_at as cart_created_at,
        c.updated_at as cart_updated_at,
        ci.cart_item_id,
        ci.product_id,
        ci.quantity,
        p.images,
        p.name,
        p.price
      FROM carts c
      LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.product_id
      WHERE c.user_id = $1
      ORDER BY ci.created_at DESC
    `;

    const result = await client.query(cartQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Check if cart exists but has no items
    const firstRow = result.rows[0];
    if (!firstRow.cart_item_id) {
      return res.status(200).json({
        success: true,
        data: {
          cart_id: firstRow.cart_id,
          user_id: firstRow.user_id,
          created_at: firstRow.cart_created_at,
          updated_at: firstRow.cart_updated_at,
          items: [],
        },
      });
    }

    // Filter out items where product doesn't exist
    const validItems = result.rows.filter((row) => row.product_id && row.name);

    // If we found invalid items, we should clean them up
    if (validItems.length < result.rows.length) {
      const invalidItemIds = result.rows
        .filter((row) => !row.product_id || !row.name)
        .map((row) => row.cart_item_id)
        .filter((id) => id); // Remove nulls

      if (invalidItemIds.length > 0) {
        await client.query(
          `DELETE FROM cart_items WHERE cart_item_id = ANY($1)`,
          [invalidItemIds]
        );
      }
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.product_id,
      image: item.images?.[0] || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        cart_id: firstRow.cart_id,
        user_id: firstRow.user_id,
        created_at: firstRow.cart_created_at,
        updated_at: firstRow.cart_updated_at,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart items",
    });
  } finally {
    if (client) client.release();
  }
};

const updateCartItemQty = async (req, res) => {
  let client;
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id; // Get from authenticated user

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    client = await db.connect();
    await client.query("BEGIN");

    // 1. Check if cart exists
    const cartResult = await client.query(
      "SELECT cart_id FROM carts WHERE user_id = $1",
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const cartId = cartResult.rows[0].cart_id;

    // 2. Check if cart item exists
    const itemResult = await client.query(
      "SELECT cart_item_id FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (itemResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    // 3. Update the quantity
    await client.query(
      "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
      [quantity, cartId, productId]
    );

    // 4. Get updated cart with product details
    const updatedCartResult = await client.query(
      `
      SELECT 
        c.cart_id,
        c.user_id,
        c.created_at as cart_created_at,
        c.updated_at as cart_updated_at,
        ci.cart_item_id,
        ci.product_id,
        ci.quantity,
        p.images,
        p.name,
        p.price
      FROM carts c
      LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.product_id
      WHERE c.user_id = $1
      ORDER BY ci.created_at DESC
    `,
      [userId]
    );

    await client.query("COMMIT");

    const firstRow = updatedCartResult.rows[0];

    if (!firstRow.cart_item_id) {
      return res.status(200).json({
        success: true,
        data: {
          cart_id: firstRow.cart_id,
          user_id: firstRow.user_id,
          created_at: firstRow.cart_created_at,
          updated_at: firstRow.cart_updated_at,
          items: [],
        },
      });
    }

    const validItems = updatedCartResult.rows.filter(
      (row) => row.product_id && row.name
    );

    const populateCartItems = validItems.map((item) => ({
      productId: item.product_id,
      image: item.images?.[0] || null,
      name: item.name || "Product not found",
      price: item.price,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        cart_id: firstRow.cart_id,
        user_id: firstRow.user_id,
        created_at: firstRow.cart_created_at,
        updated_at: firstRow.cart_updated_at,
        items: populateCartItems,
      },
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
    });
  } finally {
    if (client) client.release();
  }
};

const deleteCartItem = async (req, res) => {
  let client;

  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    client = await db.connect();
    await client.query("BEGIN");

    // Check if cart exists for the user
    const cartResult = await client.query(
      "SELECT cart_id FROM carts WHERE user_id = $1",
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const cartId = cartResult.rows[0].cart_id;

    // Delete the specific cart item
    await client.query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    // Get updated cart with product details
    const updatedCartQuery = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.created_at as cart_created_at,
        c.updated_at as cart_updated_at,
        ci.product_id,
        ci.quantity,
        p.images,
        p.name,
        p.price
      FROM carts c
      LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.product_id
      WHERE c.user_id = $1
      ORDER BY ci.created_at DESC
    `;

    const updatedCartResult = await client.query(updatedCartQuery, [userId]);

    await client.query("COMMIT");

    // Format the response similar to MongoDB structure
    const cartData = {
      cart_id: cartId,
      user_id: userId,
      items: updatedCartResult.rows
        .filter((row) => row.product_id) // Filter out empty cart
        .map((row) => ({
          productId: row.product_id,
          image: row.images,
          name: row.name || "Product not found",
          price: row.price,
          quantity: row.quantity,
        })),
      createdAt: updatedCartResult.rows[0]?.created_at,
      updatedAt: updatedCartResult.rows[0]?.updated_at,
    };

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  addToUserCart,
  addToGuestCart,
  validateProducts,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
  autoMergeGuestCart,
};
