const pool = require("../../../config/condb");


const addHomeProduct = async (req, res) => {
  const { section_id, category_id } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO home_products (section_id, category_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [section_id, category_id]
    );

    res.json({
      message: "Home category added successfully",
      homeProduct: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add home category" });
  }
};



const getHomeProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        hp.*,
        hs.name AS section_name,
        hs.limit_count,
        c.name AS category_name
      FROM home_products hp
      JOIN home_sections hs ON hp.section_id = hs.id
      JOIN categories c ON hp.category_id = c.id
      ORDER BY hp.id ASC
    `);

    res.json({ homeProducts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch home products" });
  }
};



const toggleHomeProductActive = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE home_products
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Home product not found" });
    }

    res.json({
      message: "Home product updated successfully",
      homeProduct: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle home product" });
  }
};



const deleteHomeProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM home_products WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Home product not found" });
    }

    res.json({
      message: "Home product deleted successfully",
      homeProduct: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete home product" });
  }
};

module.exports = {
  addHomeProduct,
  getHomeProducts,
  toggleHomeProductActive,
  deleteHomeProduct,
};
