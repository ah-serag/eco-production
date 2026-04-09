
const pool = require("../../config/condb");


exports.handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    const obj = data.obj; 
     
    if (!obj) return res.sendStatus(400);

    const isSuccess = String(obj.success) === 'true';
    const paymobOrderId = obj.order?.id || obj.order; 
    const paymobTransactionId = obj.id; 

    if (isSuccess) {
      await pool.query(
        `UPDATE orders
         SET status = $1,
             transaction_id = $2,
             is_paid = $3,
             paid_at = NOW(),
             updated_at = NOW(),
             payment_response = $4
         WHERE provider_order_id = $5`,
        [
          "completed",          
          paymobTransactionId, 
          true,                 
          JSON.stringify(obj),  
          String(paymobOrderId) 
        ]
      );
    } else {
      const orderResult = await pool.query(
        `UPDATE orders
         SET status = $1,
             updated_at = NOW(),
             payment_response = $2
         WHERE provider_order_id = $3
         RETURNING id`,
        ["cancelled", JSON.stringify(obj), String(paymobOrderId)]
      );

      // Restore stock for each cancelled order item
      if (orderResult.rows.length > 0) {
        const orderId = orderResult.rows[0].id;
        await pool.query(
          `UPDATE products p
           SET stock = stock + oi.quantity
           FROM order_items oi
           WHERE oi.order_id = $1 AND oi.product_id = p.id`,
          [orderId]
        );
      }
    }

    res.status(200).send("OK");

  } catch (error) {
    console.error("Internal Webhook Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};