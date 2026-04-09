const pool = require("../../../config/condb");
const uploadToCloudinary = require("../../../utils/uploadToCloudinary");

// ===============================
// Add Subcategory Banner
// ===============================
const addSubcategoryBanner = async (req, res) => {
  const { section_id, subcategory_id, category_id, direct_image, is_active } = req.body;

  if (!section_id || !subcategory_id || !category_id) {
    return res.status(400).json({ error: "section_id, category_id and subcategory_id are required" });
  }

  const desktopFile = req.files?.desktop_image?.[0];
  const mobileFile  = req.files?.mobile_image?.[0];

  if (!desktopFile || !mobileFile) {
    return res.status(400).json({ error: "Both desktop_image and mobile_image are required" });
  }

  try {
    const [desktop, mobile] = await Promise.all([
      uploadToCloudinary(desktopFile.buffer, "home/subcategory-banners/desktop"),
      uploadToCloudinary(mobileFile.buffer,  "home/subcategory-banners/mobile"),
    ]);

    await Promise.all([
      pool.query(`SELECT add_image($1, $2)`, [desktop.secure_url, desktop.public_id]),
      pool.query(`SELECT add_image($1, $2)`, [mobile.secure_url,  mobile.public_id]),
    ]);

    const result = await pool.query(
      `INSERT INTO subcategory_banners
       (section_id, category_id, subcategory_id, desktop_image_url, mobile_image_url, direct_image, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        section_id,
        category_id,
        subcategory_id,
        desktop.secure_url,
        mobile.secure_url,
        direct_image === "true" || direct_image === true,
        is_active === "false" || is_active === false ? false : true,
      ]
    );

    res.status(201).json({ message: "Subcategory banner added successfully", banner: result.rows[0] });
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
