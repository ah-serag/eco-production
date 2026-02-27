const pool = require("../../../config/condb");


const getOrders = async (req, res) => {
  try {
    const { id, status, is_paid, limit = 10, offset = 0 } = req.query;

let query = `
  SELECT 
    o.*, 
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_title', oi.product_title, -- العمود الجديد
          'product_description', oi.product_description, -- العمود الجديد
          'quantity', oi.quantity,
          'price_at_purchase', oi.price_at_purchase
        )
      ) FILTER (WHERE oi.id IS NOT NULL), '[]'
    ) AS items
  FROM orders o
  LEFT JOIN order_items oi ON o.id = oi.order_id
  WHERE 1=1
`;

    const queryParams = [];
    let paramIndex = 1;

    // فلترة بالـ ID
    if (id) {
      query += ` AND o.id = $${paramIndex++}`;
      queryParams.push(id);
    }

    // فلترة بالحالة (status)
    if (status) {
      query += ` AND o.status = $${paramIndex++}`;
      queryParams.push(status);
    }

    // فلترة بالدفع (is_paid)
    if (is_paid !== undefined) {
      query += ` AND o.is_paid = $${paramIndex++}`;
      queryParams.push(is_paid === 'true');
    }

    // التجميع والترتيب والـ Pagination
    query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, queryParams);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    console.error("Error in getOrders (Postgres):", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getAllOrderItems = async (req, res) => {
  try {
    const { order_id, product_id, limit = 10, offset = 0 } = req.query;

    let query = `
      SELECT 
        oi.id,
        oi.order_id,
        oi.product_id,
        oi.product_title,        
        oi.product_description, 
        oi.quantity,
        oi.price_at_purchase,
        oi.created_at,
        o.status as order_status, 
        o.created_at as order_date
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (order_id && order_id.trim() !== "") {
      query += ` AND oi.order_id::text LIKE $${paramIndex++}`;
      queryParams.push(`%${order_id}%`); 
    }

    if (product_id && product_id.trim() !== "") {
      query += ` AND oi.product_id::text LIKE $${paramIndex++}`;
      queryParams.push(`%${product_id}%`);
    }
 
    query += ` ORDER BY oi.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, queryParams);

    res.status(200).json({
      success: true,
      total_count: result.rowCount, 
      data: result.rows
    });
  } catch (error) {
    console.error(" Full Error Trace:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getOrderItems = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const query = `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`;
    const result = await pool.query(query, [order_id]);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error in getOrderItems (Postgres):", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getOrders,
  getOrderItems ,
  getAllOrderItems
};