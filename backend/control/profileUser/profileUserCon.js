const pool = require("../../config/condb");

const getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const userResult = await pool.query(
      `SELECT id, full_name, email, phone, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const billingResult = await pool.query(
      `SELECT id, first_name, last_name, email, phone_number,
              city, state, street, building, is_default, created_at
       FROM users_billing_data
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC
       LIMIT 1`,
      [userId]
    );

    res.status(200).json({
      user: userResult.rows[0],
      billing: billingResult.rows[0] || null,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateAccount = async (req, res) => {
  const userId = req.userId;
  const { full_name, phone } = req.body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (full_name !== undefined) { fields.push(`full_name = $${idx++}`); values.push(full_name.trim()); }
  if (phone     !== undefined) { fields.push(`phone     = $${idx++}`); values.push(phone.trim()); }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(userId);

  try {
    if (phone) {
      const phoneExists = await pool.query(
        `SELECT id FROM users WHERE phone = $1 AND id != $2`,
        [phone.trim(), userId]
      );
      if (phoneExists.rows.length > 0) {
        return res.status(409).json({ field: "phone", message: "Phone number already in use by another account" });
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${idx}
       RETURNING id, full_name, email, phone`,
      values
    );

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("updateAccount error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateBilling = async (req, res) => {
  const userId = req.userId;
  const { first_name, last_name, email, phone_number, city, state, street, building } = req.body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (first_name   !== undefined) { fields.push(`first_name   = $${idx++}`); values.push(first_name.trim()); }
  if (last_name    !== undefined) { fields.push(`last_name    = $${idx++}`); values.push(last_name.trim()); }
  if (email        !== undefined) { fields.push(`email        = $${idx++}`); values.push(email.trim()); }
  if (phone_number !== undefined) { fields.push(`phone_number = $${idx++}`); values.push(phone_number.trim()); }
  if (city         !== undefined) { fields.push(`city         = $${idx++}`); values.push(city.trim()); }
  if (state        !== undefined) { fields.push(`state        = $${idx++}`); values.push(state.trim()); }
  if (street       !== undefined) { fields.push(`street       = $${idx++}`); values.push(street.trim()); }
  if (building     !== undefined) { fields.push(`building     = $${idx++}`); values.push(building.trim()); }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(userId);

  try {
    const existing = await pool.query(
      `SELECT id FROM users_billing_data WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC LIMIT 1`,
      [userId]
    );

    let result;

    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE users_billing_data
         SET ${fields.join(", ")}, updated_at = NOW()
         WHERE id = $${idx}
         RETURNING id, first_name, last_name, email, phone_number, city, state, street, building`,
        [...values.slice(0, -1), existing.rows[0].id]
      );
    } else {
      // INSERT أول مرة
      const cols = ["user_id", "first_name", "last_name", "email", "phone_number", "city", "state", "street", "building"];
      const vals = [userId, first_name, last_name, email, phone_number, city, state, street, building];
      const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");

      result = await pool.query(
        `INSERT INTO users_billing_data (${cols.join(", ")})
         VALUES (${placeholders})
         RETURNING id, first_name, last_name, email, phone_number, city, state, street, building`,
        vals
      );
    }

    res.status(200).json({ billing: result.rows[0] });
  } catch (error) {
    console.error("updateBilling error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getProfile, updateAccount, updateBilling };
