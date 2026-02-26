const pool = require("../../../config/condb");

// ===============================
// Add Subcategory Banner
// ===============================
const addSubcategoryBanner = async (req, res) => {
  const {
    section_id,
    subcategory_id,
    image_url,
    direct_image,
    is_active
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO subcategory_banners
      (section_id, subcategory_id, image_url, direct_image, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        section_id,
        subcategory_id,
        image_url,
        direct_image ?? false,
        is_active ?? true,
      ]
    );

    res.json({
      message: "Subcategory banner added successfully",
      banner: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add subcategory banner" });
  }
};

// ===============================
// Get Subcategory Banners
// ===============================
const getSubcategoryBanners = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sb.*,
        hs.name AS section_name,
        s.name AS subcategory_name
      FROM subcategory_banners sb
      JOIN home_sections hs ON sb.section_id = hs.id
      JOIN subcategories s ON sb.subcategory_id = s.id
      ORDER BY sb.id ASC
    `);

    res.json({ subcategoryBanners: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subcategory banners" });
  }
};

// ===============================
// Toggle Active
// ===============================
const toggleSubcategoryBannerActive = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE subcategory_banners
      SET is_active = $1
      WHERE id = $2
      RETURNING *
      `,
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Subcategory banner not found" });
    }

    res.json({
      message: "Subcategory banner updated successfully",
      banner: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle subcategory banner" });
  }
};

// ===============================
// Delete Subcategory Banner
// ===============================
const deleteSubcategoryBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM subcategory_banners
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Subcategory banner not found" });
    }

    res.json({
      message: "Subcategory banner deleted successfully",
      banner: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subcategory banner" });
  }
};

module.exports = {
  addSubcategoryBanner,
  getSubcategoryBanners,
  toggleSubcategoryBannerActive,
  deleteSubcategoryBanner,
};
