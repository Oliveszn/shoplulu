const db = require("../db");
const order = require("../models/Order");
const paypal = require("../helpers/paypal");
////////FOR USERS
const createOrder = async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {
      userId,
      cartId,
      selectedAddressId,
      cartItems,
      paymentMethod,
      totalAmount,
      paymentId = null,
      payerId = null,
    } = req.body;

    if (
      !userId ||
      !selectedAddressId ||
      !cartItems ||
      !paymentMethod ||
      !totalAmount
    ) {
      throw new Error("Missing required fields");
    }

    // 1. Get the selected address details
    const addressQuery = `
      SELECT id, user_id, address_line1, city, state, postal_code, phone, phone_2, notes
      FROM address
      WHERE id = $1 AND user_id = $2
    `;

    const addressResult = await client.query(addressQuery, [
      selectedAddressId,
      userId,
    ]);

    if (addressResult.rows.length === 0) {
      throw new Error(`Address ${selectedAddressId} not found`);
    }

    const selectedAddress = addressResult.rows[0];
    if (selectedAddress.user_id !== userId) {
      throw new Error(
        `Address ${selectedAddressId} belongs to user ${address.user_id}, not ${userId}`
      );
    }

    // 2. Create the order
    const orderQuery = `
      INSERT INTO orders (
        user_id, cart_id, address_id, order_status, payment_method, 
        payment_status, total_amount, payment_id, payer_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, order_date, created_at
    `;

    const orderValues = [
      userId,
      cartId,
      selectedAddressId,
      "processing",
      paymentMethod,
      "pending",
      totalAmount,
      paymentId,
      payerId,
    ];
    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];
    const orderId = order.id;

    // 3. Create the address snapshot
    const addressSnapshotQuery = `
      INSERT INTO order_addresses (
        order_id, address_line1, city, state, postal_code, phone, phone_2, notes
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const addressValues = [
      orderId,
      selectedAddress.address_line1,
      selectedAddress.city,
      selectedAddress.state,
      selectedAddress.postal_code,
      selectedAddress.phone,
      selectedAddress.phone_2,
      selectedAddress.notes,
    ];
    await client.query(addressSnapshotQuery, addressValues);

    // 4. Create order items
    const orderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, name, images, price, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    for (const item of cartItems) {
      await client.query(orderItemsQuery, [
        orderId,
        item.productId,
        item.name,
        item.images,
        item.price,
        item.quantity,
      ]);
    }

    // 5. Optional: Clear the cart after successful order
    if (cartId) {
      await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
    }

    await client.query("COMMIT");
    // Return the complete order with all details
    return {
      id: orderId,
      userId,
      cartId: null,
      addressId: selectedAddressId,
      order_status: "processing",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount,
      orderDate: order.order_date,
      paymentId,
      payerId,
      createdAt: order.created_at,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const createOrderWithPayPal = async (req, res) => {
  const client = await db.connect();

  try {
    const {
      userId,
      cartId,
      selectedAddressId,
      cartItems,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !userId ||
      !selectedAddressId ||
      !cartItems ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate and format cart items
    const formattedItems = cartItems.map((item) => {
      // Ensure price is a number and properly formatted
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);

      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for item: ${item.name}`);
      }

      return {
        name: item.name.substring(0, 127), // PayPal has 127 char limit
        sku: item.productId.toString(),
        price: price.toFixed(2),
        currency: "USD",
        quantity: quantity,
      };
    });

    // Calculate and validate total
    const calculatedTotal = formattedItems.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    const providedTotal = parseFloat(totalAmount);

    // Allow small rounding differences (within 1 cent)
    if (Math.abs(calculatedTotal - providedTotal) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Total amount mismatch. Calculated: ${calculatedTotal.toFixed(
          2
        )}, Provided: ${providedTotal.toFixed(2)}`,
      });
    }

    // Create PayPal payment configuration
    // const create_payment_json = {
    //   intent: "sale",
    //   payer: {
    //     payment_method: "paypal",
    //   },
    //   redirect_urls: {
    //     return_url: `${process.env.CLIENT_BASE_URL}/paypal-return`,
    //     cancel_url: `${process.env.CLIENT_BASE_URL}/paypal-cancel`,
    //   },
    //   transactions: [
    //     {
    //       item_list: {
    //         items: cartItems.map((item) => ({
    //           name: item.name,
    //           sku: item.productId,
    //           price: item.price,
    //           currency: "NGN",
    //           quantity: item.quantity.toFixed(2),
    //         })),
    //       },
    //       amount: {
    //         currency: "NGN",
    //         total: totalAmount.toFixed(2),
    //       },
    //       description: "Online store purchase",
    //     },
    //   ],
    // };
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: formattedItems,
          },
          amount: {
            currency: "USD",
            total: providedTotal.toFixed(2),
            details: {
              subtotal: providedTotal.toFixed(2), // For now, subtotal equals total
            },
          },
          description: "Online store purchase",
        },
      ],
    };

    console.log(
      "PayPal payment JSON:",
      JSON.stringify(create_payment_json, null, 2)
    );

    // Create PayPal payment
    // paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
    //   if (error) {
    //     console.log("PayPal payment creation error:", error);
    //     return res.status(500).json({
    //       success: false,
    //       message: "Error while creating PayPal payment",
    //     });
    //   }

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log("PayPal payment creation error:", error);
        console.log(
          "PayPal error details:",
          JSON.stringify(error.response?.details, null, 2)
        );
        console.log(
          "Payment JSON sent:",
          JSON.stringify(create_payment_json, null, 2)
        );

        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment",
          details: error.response?.details || "Unknown PayPal error",
        });
      }

      try {
        await client.query("BEGIN");

        // Get the selected address details
        const addressQuery = `
          SELECT id, user_id, address_line1, city, state, postal_code, phone, phone_2, notes
          FROM address
          WHERE id = $1 AND user_id = $2
        `;

        const addressResult = await client.query(addressQuery, [
          selectedAddressId,
          userId,
        ]);

        if (addressResult.rows.length === 0) {
          throw new Error(`Address ${selectedAddressId} not found`);
        }

        const selectedAddress = addressResult.rows[0];
        if (selectedAddress.user_id !== userId) {
          throw new Error(
            `Address ${selectedAddressId} belongs to user ${selectedAddress.user_id}, not ${userId}`
          );
        }

        // Create the order with PayPal payment ID
        const orderQuery = `
          INSERT INTO orders (
            user_id, cart_id, address_id, order_status, payment_method, 
            payment_status, total_amount, payment_id, payer_id
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
          RETURNING id, order_date, created_at
        `;

        const orderValues = [
          userId,
          cartId,
          selectedAddressId,
          "processing",
          paymentMethod,
          "pending",
          totalAmount,
          paymentInfo.id, // PayPal payment ID
          null, // payer_id will be set during capture
        ];

        const orderResult = await client.query(orderQuery, orderValues);
        const order = orderResult.rows[0];
        const orderId = order.id;

        // Create the address snapshot
        const addressSnapshotQuery = `
          INSERT INTO order_addresses (
            order_id, address_line1, city, state, postal_code, phone, phone_2, notes
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        const addressValues = [
          orderId,
          selectedAddress.address_line1,
          selectedAddress.city,
          selectedAddress.state,
          selectedAddress.postal_code,
          selectedAddress.phone,
          selectedAddress.phone_2,
          selectedAddress.notes,
        ];
        await client.query(addressSnapshotQuery, addressValues);

        // Create order items
        const orderItemsQuery = `
          INSERT INTO order_items (order_id, product_id, name, images, price, quantity)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        for (const item of cartItems) {
          await client.query(orderItemsQuery, [
            orderId,
            item.productId,
            item.name,
            item.images,
            item.price,
            item.quantity,
          ]);
        }

        await client.query("COMMIT");

        // Get PayPal approval URL
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: orderId,
          paymentId: paymentInfo.id,
        });
      } catch (dbError) {
        await client.query("ROLLBACK");
        console.log("Database error:", dbError);
        res.status(500).json({
          success: false,
          message: "Error creating order in database",
        });
      } finally {
        client.release();
      }
    });
  } catch (error) {
    console.log("General error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  const client = await db.connect();

  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!paymentId || !payerId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
      });
    }

    await client.query("BEGIN");

    // Find the order
    const orderQuery = `
      SELECT o.*, oi.product_id, oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
    `;

    const orderResult = await client.query(orderQuery, [orderId]);

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // Group order items by order (since we're doing a LEFT JOIN)
    const orderData = orderResult.rows[0];
    const orderItems = orderResult.rows.map((row) => ({
      product_id: row.product_id,
      quantity: row.quantity,
    }));

    // Update order status and payment information
    const updateOrderQuery = `
      UPDATE orders
      SET payment_status = 'paid',
          order_status = 'confirmed',
          payment_id = $1,
          payer_id = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `;

    await client.query(updateOrderQuery, [paymentId, payerId, orderId]);

    // Update product stock for each item
    for (const item of orderItems) {
      if (item.product_id) {
        // Check if product_id exists
        // Check current stock
        const stockQuery = `
          SELECT id, name, total_stock
          FROM products
          WHERE id = $1
        `;
        const stockResult = await client.query(stockQuery, [item.product_id]);

        if (stockResult.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.product_id} not found`,
          });
        }

        const product = stockResult.rows[0];

        if (product.total_stock < item.quantity) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product ${product.name}. Available: ${product.total_stock}, Required: ${item.quantity}`,
          });
        }

        // Update stock
        const updateStockQuery = `
          UPDATE products
          SET total_stock = total_stock - $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `;
        await client.query(updateStockQuery, [item.quantity, item.product_id]);
      }
    }

    // Clear the cart if cartId exists
    if (orderData.cart_id) {
      await client.query("DELETE FROM cart_items WHERE cart_id = $1", [
        orderData.cart_id,
      ]);
    }

    await client.query("COMMIT");

    // Get the updated order data
    const finalOrderQuery = `
      SELECT o.*, oa.address_line1, oa.city, oa.state, oa.postal_code, oa.phone,
             array_agg(
               json_build_object(
                 'product_id', oi.product_id,
                 'name', oi.name,
                 'images', oi.images,
                 'price', oi.price,
                 'quantity', oi.quantity
               )
             ) as items
      FROM orders o
      LEFT JOIN order_addresses oa ON o.id = oa.order_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id, oa.address_line1, oa.city, oa.state, oa.postal_code, oa.phone
    `;

    const finalOrderResult = await client.query(finalOrderQuery, [orderId]);

    res.status(200).json({
      success: true,
      message: "Order confirmed and payment captured successfully",
      data: finalOrderResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Payment capture error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while capturing payment",
    });
  } finally {
    client.release();
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userOrders = await order.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: userOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "failed to fetch ",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetails = await order.findById(id);

    if (!orderDetails) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: orderDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

///////FOR ADMIN
const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const allOrders = await order.findAll();

    if (!allOrders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: allOrders,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(404).json({
        success: false,
        message: "Order Status is required",
      });
    }
    const updatedOrder = await order.setOrderStatus(id, order_status);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${order_status}`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);

    const statusCode = error.message.includes("Invalid") ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message.includes("Invalid")
        ? error.message
        : "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  createOrderWithPayPal,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  getAllOrdersOfAllUsers,
  updateOrderStatus,
};
