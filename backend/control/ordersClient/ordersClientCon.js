const pool = require("../../config/condb");



const getClientOrders = async (req, res) => {
  try {
    const customerId = req.userId;
    const { limit = 6, offset = 0 } = req.query;

    if (!customerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let dataQuery = `
      SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.currency,
        o.is_paid,
        o.payment_provider,
        o.billing_details,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_title', oi.product_title, 
              'quantity', oi.quantity,
              'price', oi.price_at_purchase
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE  o.user_id = $1
    `;

    // 2. استعلام لجلب الإجمالي الكلي (Count Query)
    let countQuery = `SELECT COUNT(*) FROM orders o WHERE o.user_id = $1`;

    const queryParams = [customerId];
    const countParams = [customerId];
    let paramIndex = 2;


    dataQuery += ` 
      GROUP BY o.id 
      ORDER BY o.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));

    const [result, countResult] = await Promise.all([
      pool.query(dataQuery, queryParams),
      pool.query(countQuery, countParams)
    ]);

    const totalOrders = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      total: totalOrders,
      count: result.rows.length, 
      data: result.rows
    });

  } catch (error) {
    console.error("Error in getClientOrders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getClientOrders
};