const db = require("../db");
const order = require("../models/Order");
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
      orderStatus: "processing",
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
// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId,
//       payerId,
//       cartId,
//     } = req.body;

//     const create_payment_json = {
//       intent: "sale",
//       payer: {
//         payment_method: "paypal",
//       },
//       redirect_urls: {
//         return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
//         cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
//       },
//       transactions: [
//         {
//           item_list: {
//             items: cartItems.map((item) => ({
//               name: item.title,
//               sku: item.productId,
//               price: item.price.toFixed(2),
//               currency: "USD",
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "USD",
//             total: totalAmount.toFixed(2),
//           },
//           description: "description",
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
//       if (error) {
//         console.log(error);

//         return res.status(500).json({
//           success: false,
//           message: "Error while creating paypal payment",
//         });
//       } else {
//         const newlyCreatedOrder = new Order({
//           userId,
//           cartId,
//           cartItems,
//           addressInfo,
//           orderStatus,
//           paymentMethod,
//           paymentStatus,
//           totalAmount,
//           orderDate,
//           orderUpdateDate,
//           paymentId,
//           payerId,
//         });

//         await newlyCreatedOrder.save();

//         const approvalURL = paymentInfo.links.find(
//           (link) => link.rel === "approval_url"
//         ).href;

//         res.status(201).json({
//           success: true,
//           approvalURL,
//           orderId: newlyCreatedOrder._id,
//         });
//       }
//     });
//   } catch (e) {
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order can not be found",
//       });
//     }

//     order.paymentStatus = "paid";
//     order.orderStatus = "confirmed";
//     order.paymentId = paymentId;
//     order.payerId = payerId;

//     for (let item of order.cartItems) {
//       let product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Not enough stock for this product ${product.title}`,
//         });
//       }

//       product.totalStock -= item.quantity;

//       await product.save();
//     }

//     const getCartId = order.cartId;
//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order confirmed",
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  // capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
