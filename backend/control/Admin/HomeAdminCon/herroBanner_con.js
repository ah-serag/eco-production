const pool = require("../../../config/condb");
const uploadToCloudinary = require("../../../utils/uploadToCloudinary");

const addHerobanner = async (req, res) => {
  try {
    const { section_id, cta_text, cta_link } = req.body;

    if (!section_id) return res.status(400).json({ error: "section_id is required" });

    const desktopFile = req.files?.desktop_image?.[0];
    const mobileFile  = req.files?.mobile_image?.[0];

    if (!desktopFile || !mobileFile) {
      return res.status(400).json({ error: "Both desktop_image and mobile_image are required" });
    }

    const [desktopRes, mobileRes] = await Promise.all([
      uploadToCloudinary(desktopFile.buffer, "banners/desktop"),
      uploadToCloudinary(mobileFile.buffer,  "banners/mobile"),
    ]);

    await Promise.all([
      pool.query(`SELECT add_image($1, $2) AS id`, [desktopRes.secure_url, desktopRes.public_id]),
      pool.query(`SELECT add_image($1, $2) AS id`, [mobileRes.secure_url,  mobileRes.public_id]),
    ]);

    const result = await pool.query(
      `INSERT INTO hero_banners (section_id, desktop_image_url, mobile_image_url, cta_text, cta_link)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [section_id, desktopRes.secure_url, mobileRes.secure_url, cta_text || null, cta_link || null]
    );

    res.status(201).json({ message: "Banner added successfully", banner: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to add hero banner" });
  }
};


const getHeroBanners = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT hb.*, hs.name AS section_name
      FROM hero_banners hb
      JOIN home_sections hs ON hb.section_id = hs.id
      ORDER BY hb.id ASC
    `);
    res.json({ heroBanners: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hero banners" });
  }
};


const toggleHeroBannerActive = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE hero_banners SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Hero banner not found" });
    }

    res.json({ message: "Hero banner updated successfully", heroBanner: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle hero banner" });
  }
};


const deleteHeroBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM hero_banners WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Hero banner not found" });
    }

    res.json({ message: "Hero banner deleted successfully", heroBanner: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete hero banner" });
  }
};



module.exports = {getHeroBanners ,toggleHeroBannerActive ,deleteHeroBanner ,addHerobanner }

