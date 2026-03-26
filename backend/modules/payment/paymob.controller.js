const paymobService = require("./paymob.service");
const pool = require("../../config/condb");
const { integrationIdWallet, integrationIdCard } = require("../../config/paymob.config");
const axios = require("axios");
const bcrypt =  require("bcrypt") 






const getOrCreateUser = async (client, userId, billingData) => {
  if (userId) return userId;

  const userCheck = await client.query(
    "SELECT id FROM users WHERE email = $1",
    [billingData.email]
  );

  if (userCheck.rows.length > 0) {
    return userCheck.rows[0].id;
  }

  const password_hash = await bcrypt.hash(billingData.phone_number, 10);
  
  const newGuest = await client.query(
    `INSERT INTO users (full_name, email, role, is_active, password_hash) 
     VALUES ($1, $2, 'guest', true, $3) RETURNING id`,
    [
      `${billingData.first_name} ${billingData.last_name}`,
      billingData.email,
      password_hash
    ]
  );

  return newGuest.rows[0].id;
};

const processOrderAndItems = async (client, userId, items, statu ,payment_provider ,billingData) => {
  const productIds = items.map(item => item.id);
  
  // Fetch active products
  const productResult = await client.query(
    `SELECT id, title, description, discount_price, stock 
     FROM products 
     WHERE id = ANY($1) AND is_active = true`,
    [productIds]
  );

  const dbProducts = productResult.rows;

  if (dbProducts.length !== items.length) {
    throw new Error("Some products are missing or inactive");
  }

  let totalAmount = 0;
  const processedItems = [];

  // Validate stock and calculate total
  for (const cartItem of items) {
    const dbProduct = dbProducts.find(p => p.id === cartItem.id);
    const quantity = Number(cartItem.quantity) || 1;

    if (quantity > dbProduct.stock) {
      throw new Error(`Insufficient stock for product: ${dbProduct.title}`);
    }

    const price = Number(dbProduct.discount_price);
    totalAmount += price * quantity;

    processedItems.push({
      id: dbProduct.id,
      title: dbProduct.title,
      description: dbProduct.description,
      price,
      quantity
    });
  }

  // Insert main order
  const orderResult = await client.query(
    `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details)
     VALUES ($1, $2 , $3, 'EGP', $4 ,$5 ) RETURNING id`,
    [userId,statu , totalAmount ,payment_provider, JSON.stringify(billingData)]
  );

  const orderId = orderResult.rows[0].id;

  // Insert order items
  for (const pItem of processedItems) {
    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, pItem.id, pItem.quantity, pItem.price, pItem.title, pItem.description]
    );
  
    await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [pItem.quantity, pItem.id]);

  }

  return { orderId, totalAmount };
};

const addBillingDataToUser = async (client, userId, billingData) => {

  const checkResult = await client.query(
    "SELECT id FROM users_billing_data WHERE user_id = $1 AND email = $2",
    [userId, billingData.email]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  const insertResult = await client.query(
    `INSERT INTO users_billing_data (
      user_id, first_name, last_name, email, phone_number, city, state, street, building
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      userId,
      billingData.first_name,
      billingData.last_name,
      billingData.email,
      billingData.phone_number,
      billingData.city,
      billingData.state,
      billingData.street,
      billingData.building
    ]
  );

  return insertResult.rows[0].id;
};


// 1. Online Card Checkout
exports.checkout = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, billingData } = req.body;
    let userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }
    
    await client.query("BEGIN");
     
    if (!userId) {
    userId = await getOrCreateUser(client ,userId ,billingData)
    }
   

    ///  
    
   await addBillingDataToUser(client ,userId ,billingData)
   const OrderAndItems = await processOrderAndItems(client ,userId,items,"pending", "Card" ,billingData)

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(OrderAndItems.totalAmount * 100);
    const paymobOrder = await paymobService.createOrder(token, {
      amount: amountInCents,
      billingData: billingData,
    });

    await client.query(`UPDATE orders SET provider_order_id = $1 WHERE id = $2`, [paymobOrder.id, OrderAndItems.orderId]);
    const paymentKey = await paymobService.generatePaymentKey(token, paymobOrder.id, amountInCents, billingData, integrationIdCard);

    await client.query("COMMIT");
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.json({ iframeUrl });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message || "Checkout failed" });
  } finally {
    client.release();
  }
};

// 2. Wallet Checkout
exports.checkoutWallet = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, billingData, walletNumber } = req.body;
    let userId = req.userId;

    if (!walletNumber) return res.status(400).json({ error: "Wallet number is required" });
    if (!items || items.length === 0) return res.status(400).json({ error: "No items provided" });

    await client.query("BEGIN");

    if (!userId) {
    userId = await getOrCreateUser(client ,userId ,billingData)
    }

     await addBillingDataToUser(client ,userId ,billingData)
     const OrderAndItems = await processOrderAndItems(client ,userId,items,"pending" ,"Wallet" ,billingData)

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(OrderAndItems.totalAmount * 100);
    const paymobOrder = await paymobService.createOrder(token, { amount: amountInCents, billingData });
    const paymentKey = await paymobService.generatePaymentKey(token, paymobOrder.id, amountInCents, billingData, integrationIdWallet);

    const response = await axios.post("https://accept.paymob.com/api/acceptance/payments/pay", {
      source: { identifier: walletNumber, subtype: "WALLET" },
      payment_token: paymentKey
    });

    if (!response.data.redirect_url) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Failed to get redirect URL" });
    }

    await client.query(`UPDATE orders SET provider_order_id = $1 WHERE id = $2`, [paymobOrder.id, OrderAndItems.orderId]);
    await client.query("COMMIT");
    res.json({ redirectUrl: response.data.redirect_url });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};



exports.checkoutCash = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, billingData } = req.body;
    let userId = req.userId;

    if (!items || items.length === 0) return res.status(400).json({ error: "No items provided" });

    await client.query("BEGIN");

    if (!userId) {
    userId = await getOrCreateUser(client ,userId ,billingData)
    }

    await addBillingDataToUser(client ,userId ,billingData)
    const OrderAndItems = await processOrderAndItems(client ,userId,items,"processing", "cash on delivary" ,billingData)
    await client.query("COMMIT");
    res.status(201).json({ success: true, orderId: OrderAndItems.orderId, redirectUrl: `/order-success?success=true&id=${OrderAndItems.orderId}` });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};