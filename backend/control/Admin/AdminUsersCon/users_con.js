const pool = require("../../../config/condb");


const getUsers = async (req, res) => {
  try {
    const { role, status, search, limit = 10, offset = 0 } = req.query;

    const dataQuery = `
      SELECT id, full_name, email, phone, role, is_active, last_login, created_at
      FROM users
      WHERE ($1::text IS NULL OR role = $1)
        AND ($2::text IS NULL OR full_name ILIKE '%' || $2 || '%' OR email ILIKE '%' || $2 || '%' OR id::text ILIKE '%' || $2 || '%')
        AND ($3::text IS NULL OR is_active = ($3 = 'active') )
      ORDER BY created_at DESC
      LIMIT $4 OFFSET $5;
    `;

    const dataValues = [
      role || null,
      search || null,
      status || null,
      Number(limit),
      Number(offset),
    ];

    const countQuery = `
      SELECT COUNT(*)
      FROM users
      WHERE ($1::text IS NULL OR role = $1)
        AND ($2::text IS NULL OR full_name ILIKE '%' || $2 || '%' OR email ILIKE '%' || $2 || '%' OR id::text ILIKE '%' || $2 || '%')
        AND ($3::text IS NULL OR is_active = ($3 = 'active') )
    `;

    const countValues = [
      role || null,
      search || null,
      status || null
    ];

    const [dataRes, totalRes] = await Promise.all([
      pool.query(dataQuery, dataValues),
      pool.query(countQuery, countValues)
    ]);

    res.json({
      data: dataRes.rows,
      total: Number(totalRes.rows[0].count),
      limit: Number(limit),
      offset: Number(offset),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
const SetRole = async ( req ,res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin" , "vendor"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, full_name, email, role",
      [role, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


const SetActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body; 

    if (typeof is_active !== "boolean") {
      return res.status(400).json({ message: "is_active must be a boolean" });
    }

    const checkRole = await pool.query(`SELECT id, role FROM users WHERE id = $1`, [id]);

    if (checkRole.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUser = checkRole.rows[0];
    const actorRole = req.user.role; 

    
    if (targetUser.role === "Super Admin") {
      return res.status(403).json({
        message: "Super Admin cannot be disabled"
      });
    }


    if (actorRole === "admin" && targetUser.role === "admin") {
      return res.status(403).json({
        message: "Admin cannot disable another admin"
      });
    }

    if (actorRole === "admin" && req.user.id === targetUser.id) {
      return res.status(403).json({
        message: "Admin cannot disable himself"
      });
    }

    const query = `
      UPDATE users
      SET is_active = $1
      WHERE id = $2;
    `;
    const values = [is_active, id];

    const { rows } = await pool.query(query, values);

    res.json({ message: "User status updated", user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUsers = async (req ,res) =>{

  const { id } = req.params;

  const { rows } = await pool.query("SELECT role FROM users WHERE id = $1", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = rows[0];

  if (user.role === "admin") {
    return res.status(403).json({ message: "Cannot delete an admin user" });
  }

  await pool.query("DELETE FROM users WHERE id = $1", [id]);

  res.status(200).json({ message: "User deleted successfully" });
}

module.exports = {getUsers ,SetRole ,SetActive ,deleteUsers}
