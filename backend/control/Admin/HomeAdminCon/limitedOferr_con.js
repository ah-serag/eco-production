const pool = require("../../../config/condb");

/**
 * Add Limited Offer Banner
 */
const addLimitedOfferBanner = async (req, res) => {
  const {
    section_id,
    image_url,
    link_url,
    start_at,
    end_at
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO limited_offer_banners
      (section_id, image_url, link_url, start_at, end_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [section_id, image_url, link_url, start_at, end_at]
    );

    res.json({
      message: "Limited offer banner added successfully",
      banner: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add limited offer banner" });
  }
};


/**
 * Get All Limited Offer Banners (Admin)
 */
const getLimitedOfferBanners = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lob.*, hs.name AS section_name
      FROM limited_offer_banners lob
      JOIN home_sections hs ON lob.section_id = hs.id
      ORDER BY lob.id ASC
    `);

    res.json({ limitedOfferBanners: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch limited offer banners" });
  }
};


/**
 * Toggle Active
 */
const toggleLimitedOfferBannerActive = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE limited_offer_banners
      SET is_active = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Limited offer banner not found" });
    }

    res.json({
      message: "Limited offer banner updated successfully",
      banner: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle limited offer banner" });
  }
};


/**
 * Delete Banner
 */
const deleteLimitedOfferBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM limited_offer_banners
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Limited offer banner not found" });
    }

    res.json({
      message: "Limited offer banner deleted successfully",
      banner: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete limited offer banner" });
  }
};


/**
 * Get Active Limited Offer Banner (Frontend)
 */
const getActiveLimitedOfferBanner = async (req, res) => {
  const { section_id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM limited_offer_banners
      WHERE
        section_id = $1
        AND is_active = true
        AND NOW() BETWEEN start_at AND end_at
      LIMIT 1
      `,
      [section_id]
    );

    res.json({ banner: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch active limited offer banner" });
  }
};

module.exports = {
  addLimitedOfferBanner,
  getLimitedOfferBanners,
  toggleLimitedOfferBannerActive,
  deleteLimitedOfferBanner,
  getActiveLimitedOfferBanner,
};
