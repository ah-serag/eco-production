
const pool = require("../../../config/condb");


const AddSections =   async (req, res) => {
  const { name, type, content, order_index, is_active } = req.body;

  const result = await pool.query(
    `
    INSERT INTO home_sections (name, type, content, order_index, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, type, content, order_index ?? 0, is_active ?? true]
  );

  res.json({
    message: "Section added successfully",
    section: result.rows[0],
  });
  
};

 const getSections = async (req, res) => {
  const { type } = req.query;

  const result = await pool.query(
    `
    SELECT id, name
    FROM home_sections
    WHERE type = $1 AND is_active = true
    ORDER BY order_index
    `,
    [type]
  );

  res.json({ sections: result.rows });
};




/// read + edait 

const previewAdmin = async (req, res) => {
  try {
    const sectionsResult = await pool.query(
      "SELECT * FROM home_sections ORDER BY order_index ASC"
    );

    const sections = sectionsResult.rows;

    const sectionsWithItems = await Promise.all(
      sections.map(async (section) => {
        
        if (section.type === "hero") {
          const bannersResult = await pool.query(
            "SELECT * FROM hero_banners WHERE section_id = $1 ORDER BY id ASC",
            [section.id]
          );
          return { ...section, items: bannersResult.rows };
        }
        if(section.type === "category"){
          const categoryHomeResult = await pool.query(
            `SELECT * FROM home_categories WHERE section_id = $1 ORDER BY id ASC `
          , [section.id] )
          return {...section ,items : categoryHomeResult.rows}
        }
        if(section.type === "Limited_Offer"){
          const limitedOfferHomeResult = await pool.query(
            `SELECT * FROM limited_offer_banners WHERE section_id = $1 ORDER BY id ASC `
          , [section.id] )
          return {...section ,items : limitedOfferHomeResult.rows}
        }
      

        if(section.type === "subcategory_banner"){
          const subcategory_banner = await pool.query(
            `SELECT * FROM subcategory_banners WHERE section_id = $1 ORDER BY id ASC `
          , [section.id] )
          return {...section ,items : subcategory_banner.rows}
        }


        return { ...section, items: [] };
      })

    );

    res.json({ sections: sectionsWithItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
};

const updateSectionsOrderBulk = async (req, res) => {
  const { sections } = req.body;

  if (!Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ error: "sections array is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const section of sections) {
      await client.query(
        `
        UPDATE home_sections
        SET order_index = $1, updated_at = NOW()
        WHERE id = $2
        `,
        [section.order_index, section.id]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Sections order updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to update sections order" });
  } finally {
    client.release();
  }
};
 


 const toggleActiveSection =  async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    const result = await pool.query(
      "UPDATE home_sections SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Section not found" });
    }

    res.json({ message: "Section updated successfully", section: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update section" });
  }
};

const deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    // Optionally, delete related items like hero_banners first
    await pool.query("DELETE FROM hero_banners WHERE section_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM home_sections WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Section not found" });
    }

    res.json({ message: "Section deleted successfully", section: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete section" });
  }
};

module.exports = {AddSections ,getSections  ,previewAdmin ,toggleActiveSection ,deleteSection , updateSectionsOrderBulk}


