const pool = require("../../../config/condb");


// hero 

const addHerobanner = async (req, res) => {
  const {
    section_id,
    title,
    subtitle,
    image_url,
    cta_text,
    cta_link
  } = req.body;

  const result = await pool.query(
    `
    INSERT INTO hero_banners
    (section_id, title, subtitle, image_url, cta_text, cta_link)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [section_id, title, subtitle, image_url, cta_text, cta_link]
  );

  res.json({
    message: "Banner added successfully",
    banner: result.rows[0],
  });
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

