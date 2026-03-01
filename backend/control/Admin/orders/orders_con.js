const pool = require("../../../config/condb");


const getOrders = async (req, res) => {
  try {
    const { id, status, limit = 10, offset = 0 } = req.query;

    let dataQuery = `
      SELECT 
        o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_title', oi.product_title, 
              'product_description', oi.product_description,
              'quantity', oi.quantity,
              'price_at_purchase', oi.price_at_purchase
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;

    let countQuery = `SELECT COUNT(DISTINCT o.id) FROM orders o WHERE 1=1`;

    const queryParams = [];
    const countParams = [];
    let paramIndex = 1;

    if (id) {
      const filter = ` AND o.id::text LIKE $${paramIndex}`;
      dataQuery += filter;
      countQuery += filter;
      const searchVal = `%${id}%`;
      queryParams.push(searchVal);
      countParams.push(searchVal);
      paramIndex++;
    }

    if (status) {
      const filter = ` AND o.status = $${paramIndex}`;
      dataQuery += filter;
      countQuery += filter;
      queryParams.push(status);
      countParams.push(status);
      paramIndex++;
    }

    dataQuery += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, queryParams),
      pool.query(countQuery, countParams)
    ]);

    res.status(200).json({
      success: true,
      total: parseInt(countResult.rows[0].count), 
      count: dataResult.rows.length,              
      data: dataResult.rows                       
    });

  } catch (error) {
    console.error("Error in getOrders (Postgres):", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllOrderItems = async (req, res) => {
  try {
    const { order_id, product_id, limit = 10, offset = 0 } = req.query;

    let dataQuery = `
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

    let countQuery = `
      SELECT COUNT(*) 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE 1=1
    `;

    const queryParams = [];
    const countParams = [];
    let paramIndex = 1;

    if (order_id && order_id.trim() !== "") {
      const filter = ` AND oi.order_id::text LIKE $${paramIndex}`;
      dataQuery += filter;
      countQuery += filter;
      const searchVal = `%${order_id}%`;
      queryParams.push(searchVal);
      countParams.push(searchVal);
      paramIndex++;
    }

    if (product_id && product_id.trim() !== "") {
      const filter = ` AND oi.product_id::text LIKE $${paramIndex}`;
      dataQuery += filter;
      countQuery += filter;
      const searchVal = `%${product_id}%`;
      queryParams.push(searchVal);
      countParams.push(searchVal);
      paramIndex++;
    }

    dataQuery += ` ORDER BY oi.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, queryParams),
      pool.query(countQuery, countParams)
    ]);

    res.status(200).json({
      success: true,
      total: parseInt(countResult.rows[0].count), 
      count: dataResult.rows.length,              
      data: dataResult.rows                       
    });

  } catch (error) {
    console.error("Full Error Trace:", error);
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