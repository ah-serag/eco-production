const pool = require("../../config/condb");




const getBillingDataUser = async (req, res) => {
  const userid = req.userId;

  if (!userid) {
    return res.status(200).json(null); 
  }

  try {
    const query = `
      SELECT first_name, last_name, email, phone_number, city, state, street, building
      FROM users_billing_data
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [userid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: "No billing data found for this user." 
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching billing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {getBillingDataUser}