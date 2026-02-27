
const pool = require("../../config/condb");


exports.handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    const obj = data.obj; 
    
    if (!obj) return res.sendStatus(400);

    const isSuccess = String(obj.success) === 'true';
    const paymobOrderId = obj.order?.id || obj.order; 
    const paymobTransactionId = obj.id; 

    console.log(`Webhook Received - Paymob Order: ${paymobOrderId}, Success: ${isSuccess}`);

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
      console.log(`Order #${paymobOrderId} updated to PAID`);
    } else {
      await pool.query(
        `UPDATE orders
         SET status = $1,
             updated_at = NOW(),
             payment_response = $2
         WHERE provider_order_id = $3`,
        ["cancelled", JSON.stringify(obj), String(paymobOrderId)]
      );
      console.log(` Order #${paymobOrderId} updated to FAILED`);
    }

    res.status(200).send("OK");

  } catch (error) {
    console.error("Internal Webhook Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};