exports.handleWebhook = async (req, res) => {
  try {
    const data = req.body;

    const obj = data.obj;
    if (!obj) return res.sendStatus(400);

    const isSuccess = String(obj.success) === 'true';
    
    const paymobOrderId = obj.order?.id || obj.order; 
    const transactionId = obj.id;

    console.log(`Processing Order: ${paymobOrderId}, Success: ${isSuccess}`);

    if (isSuccess) {
      await pool.query(
        `UPDATE orders
         SET status = $1,
             paymob_transaction_id = $2,
             updated_at = NOW()
         WHERE paymob_order_id = $3`,
        ["paid", transactionId, paymobOrderId]
      );
      console.log(" Order updated to paid:", paymobOrderId);
    } else {
      await pool.query(
        `UPDATE orders
         SET status = $1,
             updated_at = NOW()
         WHERE paymob_order_id = $2`,
        ["failed", paymobOrderId]
      );
      console.log(" Order updated to failed:", paymobOrderId);
    }

    res.status(200).send("OK");

  } catch (error) {
    console.error("Internal Webhook Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};