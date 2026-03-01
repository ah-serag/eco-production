const paymobService = require("./paymob.service");
const pool = require("../../config/condb");
const { integrationIdWallet, integrationIdCard } = require("../../config/paymob.config");
const axios = require("axios");

exports.checkout = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, billingData } = req.body; 
    const userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    await client.query("BEGIN");

    const productIds = items.map(item => item.id);

    const productResult = await client.query(
      `SELECT id, title, description, discount_price 
       FROM products 
       WHERE id = ANY($1) AND is_active = true`,
      [productIds]
    );

    const dbProducts = productResult.rows;

    if (dbProducts.length !== items.length) {
      throw new Error("Some products are missing or inactive");
    }

    let totalAmount = 0;
    
    const processedItems = items.map(cartItem => {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      
      const quantity = Number(cartItem.quantity) || 1;
      const price = Number(dbProduct.discount_price);
      
      if (isNaN(price)) {
        throw new Error(`Invalid price for product ${dbProduct.id}`);
      }

      totalAmount += price * quantity;

      return {
        id: dbProduct.id,
        title: dbProduct.title,             
        description: dbProduct.description, 
        price: price,
        quantity: quantity
      };
    });

    const orderResult = await client.query(
      `INSERT INTO orders 
         (user_id, status, total_amount, currency, payment_provider, billing_details)
       VALUES ($1, 'pending', $2, 'EGP', 'paymob', $3)
       RETURNING id`,
      [userId, totalAmount, JSON.stringify(billingData)]
    );

    const orderId = orderResult.rows[0].id;

    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items 
          (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId, 
          pItem.id, 
          pItem.quantity, 
          pItem.price, 
          pItem.title,     
          pItem.description   
        ]
      );
    }

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(totalAmount * 100);

    const paymobOrder = await paymobService.createOrder(token, {
      amount: amountInCents, 
      billingData: billingData, 
    });

    await client.query(
      `UPDATE orders SET provider_order_id = $1 WHERE id = $2`,
      [paymobOrder.id, orderId]
    );

    const paymentKey = await paymobService.generatePaymentKey(
      token,
      paymobOrder.id,
      amountInCents,
      billingData,
      integrationIdCard
    );

    await client.query("COMMIT");

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    res.json({ iframeUrl });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout Error:", err.message);
    res.status(400).json({ error: err.message || "Checkout process failed" });
  } finally {
    client.release();
  }
};





exports.checkoutWallet = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, billingData, walletNumber } = req.body; 
    const userId = req.userId;

    if (!walletNumber) {
      return res.status(400).json({ error: "Wallet number is required" });
    }

    await client.query("BEGIN");

    const productIds = items.map(item => item.id);
    const productResult = await client.query(
      `SELECT id, title, description, discount_price FROM products WHERE id = ANY($1) AND is_active = true`,
      [productIds]
    );

    const dbProducts = productResult.rows;
    if (dbProducts.length !== items.length) throw new Error("Some products are missing");

    let totalAmount = 0;
    const processedItems = items.map(cartItem => {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      const quantity = Number(cartItem.quantity) || 1;
      const price = Number(dbProduct.discount_price);
      totalAmount += price * quantity;
      return { id: dbProduct.id, title: dbProduct.title, price, quantity };
    });

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details)
       VALUES ($1, 'pending', $2, 'EGP', 'paymob_wallet', $3) RETURNING id`,
      [userId, totalAmount, JSON.stringify(billingData)]
    );
    const orderId = orderResult.rows[0].id;

    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)`,
        [orderId, pItem.id, pItem.quantity, pItem.price]
      );
    }

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(totalAmount * 100);

    const paymobOrder = await paymobService.createOrder(token, {
      amount: amountInCents, 
      billingData: billingData, 
    });

    const paymentKey = await paymobService.generatePaymentKey(
      token,
      paymobOrder.id,
      amountInCents,
      billingData,
      process.env.PAYMOB_WALLET_INTEGRATION_ID 
    );

    const response = await axios.post("https://accept.paymob.com/api/acceptance/payments/pay", {
      source: {
        identifier: walletNumber,
        subtype: "WALLET"
      },
      payment_token: paymentKey
    });

    const walletData = response.data;
      
    if (!walletData.redirect_url) {
      throw new Error("Failed to get wallet redirect URL from Paymob");
    }

    await client.query(
      `UPDATE orders SET provider_order_id = $1 WHERE id = $2`,
      [paymobOrder.id, orderId]
    );

    await client.query("COMMIT");
    
    res.json({ redirectUrl: walletData.redirect_url });

  } catch (err) {
    await client.query("ROLLBACK");
    
    const errorMessage = err.response?.data?.message || err.message;
    console.error("Checkout Wallet Error:", errorMessage);
    res.status(400).json({ error: errorMessage });
  } finally {
    client.release();
  }
};

exports.checkoutCash = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, billingData } = req.body;
    const userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    if (!billingData || !billingData.phone_number) {
      return res.status(400).json({ error: "Billing information is incomplete" });
    }

    await client.query("BEGIN");

    const productIds = items.map(item => item.id);
    const productResult = await client.query(
      `SELECT id, title, description, discount_price, stock 
       FROM products 
       WHERE id = ANY($1) AND is_active = true`,
      [productIds]
    );

    const dbProducts = productResult.rows;

    if (dbProducts.length !== items.length) {
      throw new Error("Some products are missing or currently unavailable");
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const cartItem of items) {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      const quantity = Number(cartItem.quantity) || 1;
      const price = Number(dbProduct.discount_price);
      

      totalAmount += price * quantity;

      processedItems.push({
        id: dbProduct.id,
        title: dbProduct.title,
        description: dbProduct.description,
        price: price,
        quantity: quantity
      });
    }

    const orderResult = await client.query(
      `INSERT INTO orders 
         (user_id, status, total_amount, currency, payment_provider, billing_details)
       VALUES ($1, 'processing', $2, 'EGP', 'cash_on_delivery', $3)
       RETURNING id`,
      [userId, totalAmount, JSON.stringify(billingData)]
    );

    const orderId = orderResult.rows[0].id;

    // order_items
    const insertItemsQuery = `
      INSERT INTO order_items 
        (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const pItem of processedItems) {
      await client.query(insertItemsQuery, [
        orderId,
        pItem.id,
        pItem.quantity,
        pItem.price,
        pItem.title,
        pItem.description
      ]);
      
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [pItem.quantity, pItem.id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      orderId: orderId,
      redirectUrl: `/order-success?order_id=${orderId}` 
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Cash Checkout Error:", err.message);
    res.status(500).json({ error: err.message || "Failed to process cash order" });
  } finally {
    client.release();
  }
};