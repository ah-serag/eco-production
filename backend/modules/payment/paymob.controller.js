const paymobService = require("./paymob.service");
const pool = require("../../config/condb");

exports.checkout = async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, billingData } = req.body; 
    const userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    await client.query("BEGIN");

    // 1. Get all product IDs
    const productIds = items.map(item => item.id);

    // 2. IMPORTANT: Must SELECT discount_price here to use it later
    const productResult = await client.query(
      `SELECT id, discount_price FROM products WHERE id = ANY($1) AND is_active = true`,
      [productIds]
    );

    const dbProducts = productResult.rows;

    // 3. Verify products exist
    if (dbProducts.length !== items.length) {
      throw new Error("Some products are missing or inactive");
    }

    let totalAmount = 0;
    
    // 4. Calculate total using discount_price
    const processedItems = items.map(cartItem => {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);
      
      const quantity = Number(cartItem.quantity) || 1;
      // Use discount_price from DB result
      const price = Number(dbProduct.discount_price);
      
      if (isNaN(price)) {
        throw new Error(`Invalid price for product ${dbProduct.id}`);
      }

      totalAmount += price * quantity;

      return {
        id: dbProduct.id,
        price: price,
        quantity: quantity
      };
    });

    // 5. Create main order
    const orderResult = await client.query(
      `INSERT INTO orders 
        (user_id, status, total_amount, currency, payment_provider)
       VALUES ($1, 'pending', $2, 'EGP', 'paymob')
       RETURNING id`,
      [userId, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // 6. Bulk insert order items
    for (const pItem of processedItems) {
      await client.query(
        `INSERT INTO order_items 
          (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, pItem.id, pItem.quantity, pItem.price]
      );
    }

    // 7. Paymob integration
    const token = await paymobService.getAuthToken();
    
    // Paymob needs amount in Cents (Integer)
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
      billingData
    );

    await client.query("COMMIT");

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    res.json({ iframeUrl });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout Error:", err.message);
    // Return specific error message to help debugging
    res.status(400).json({ error: err.message || "Checkout process failed" });
  } finally {
    client.release();
  }
};