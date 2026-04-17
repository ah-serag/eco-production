const pool = require("../../../config/condb");

// GET all coupons
const getCoupons = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM coupons ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add coupon
const addCoupon = async (req, res) => {
  const {
    code,
    description,
    discount_type,
    discount_value,
    min_order_value,
    max_discount_amount,
    usage_limit,
    expiry_date,
    is_active,
  } = req.body;

  if (!code || !discount_type || !discount_value || !expiry_date) {
    return res.status(400).json({ message: "code, discount_type, discount_value, expiry_date are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO coupons
        (code, description, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, expiry_date, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        code.toUpperCase().trim(),
        description || null,
        discount_type,
        discount_value,
        min_order_value || 0,
        max_discount_amount || null,
        usage_limit || null,
        expiry_date,
        is_active !== undefined ? is_active : true,
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM coupons WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ success: true, message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH toggle active
const toggleCouponStatus = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (is_active === undefined) {
    return res.status(400).json({ message: "is_active is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE coupons SET is_active = $1 WHERE id = $2 RETURNING *`,
      [is_active, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCoupons, addCoupon, deleteCoupon, toggleCouponStatus };
