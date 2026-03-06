const paymobService = require("./paymob.service");
const pool = require("../../config/condb");
const { integrationIdWallet, integrationIdCard } = require("../../config/paymob.config");
const axios = require("axios");

// 1. Online Card Checkout
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
      `SELECT id, title, description, discount_price, stock 
       FROM products 
       WHERE id = ANY($1) AND is_active = true`,
      [productIds]
    );

    const dbProducts = productResult.rows;
    if (dbProducts.length !== items.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Some products are missing or inactive" });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const cartItem of items) {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      const quantity = Number(cartItem.quantity) || 1;
      
      if (quantity > dbProduct.stock) {
        await client.query("ROLLBACK");
        return res.status(400).json({ 
          error: `Insufficient stock for ${dbProduct.title}. Available: ${dbProduct.stock}` 
        });
      }

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
      `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details)
       VALUES ($1, 'pending', $2, 'EGP', 'paymob_card', $3) RETURNING id`,
      [userId, totalAmount, JSON.stringify(billingData)]
    );

    const orderId = orderResult.rows[0].id;

    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, pItem.id, pItem.quantity, pItem.price, pItem.title, pItem.description]
      );
    }

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(totalAmount * 100);
    const paymobOrder = await paymobService.createOrder(token, {
      amount: amountInCents,
      billingData: billingData,
    });

    await client.query(`UPDATE orders SET provider_order_id = $1 WHERE id = $2`, [paymobOrder.id, orderId]);
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
    const userId = req.userId;

    if (!walletNumber) return res.status(400).json({ error: "Wallet number is required" });
    if (!items || items.length === 0) return res.status(400).json({ error: "No items provided" });

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
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Products missing" });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const cartItem of items) {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      const quantity = Number(cartItem.quantity) || 1;

      if (quantity > dbProduct.stock) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: `Insufficient stock for ${dbProduct.title}` });
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

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details)
       VALUES ($1, 'pending', $2, 'EGP', 'paymob_wallet', $3) RETURNING id`,
      [userId, totalAmount, JSON.stringify(billingData)]
    );

    const orderId = orderResult.rows[0].id;

    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
         VALUES ($1, $2, $3, $4, $5, $6)`, 
        [orderId, pItem.id, pItem.quantity, pItem.price, pItem.title, pItem.description]
      );
    }

    const token = await paymobService.getAuthToken();
    const amountInCents = Math.round(totalAmount * 100);
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

    await client.query(`UPDATE orders SET provider_order_id = $1 WHERE id = $2`, [paymobOrder.id, orderId]);
    await client.query("COMMIT");
    res.json({ redirectUrl: response.data.redirect_url });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// 3. Cash on Delivery
exports.checkoutCash = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, billingData } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) return res.status(400).json({ error: "No items provided" });

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
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Products missing" });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const cartItem of items) {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      const quantity = Number(cartItem.quantity) || 1;

      if (quantity > dbProduct.stock) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: `Insufficient stock for ${dbProduct.title}` });
      }

      const price = Number(dbProduct.discount_price);
      totalAmount += price * quantity;
      processedItems.push({ id: dbProduct.id, title: dbProduct.title, description: dbProduct.description, price, quantity });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount, currency, payment_provider, billing_details)
       VALUES ($1, 'processing', $2, 'EGP', 'cash_on_delivery', $3) RETURNING id`,
      [userId, totalAmount, JSON.stringify(billingData)]
    );

    const orderId = orderResult.rows[0].id;

    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_title, product_description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, pItem.id, pItem.quantity, pItem.price, pItem.title, pItem.description]
      );

      await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [pItem.quantity, pItem.id]);
    }

    await client.query("COMMIT");
    res.status(201).json({ success: true, orderId: orderId, redirectUrl: `/order-success?success=true&id=${orderId}` });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};