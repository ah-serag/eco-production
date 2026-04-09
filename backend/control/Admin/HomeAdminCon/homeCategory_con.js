const pool = require("../../../config/condb");
const uploadToCloudinary = require("../../../utils/uploadToCloudinary");

const addHomeCategory = async (req, res) => {
  try {
    const { section_id, category_id, title } = req.body;

    if (!section_id || !category_id) {
      return res.status(400).json({ message: "section_id and category_id are required" });
    }

    const imageFile = req.file || req.files?.[0];
    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploaded = await uploadToCloudinary(imageFile.buffer, "home/categories");

    await pool.query(
      `SELECT add_image($1, $2) AS id`,
      [uploaded.secure_url, uploaded.public_id]
    );

    const result = await pool.query(
      `INSERT INTO home_categories (section_id, category_id, image_url, title)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [section_id, category_id, uploaded.secure_url, title || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Category already exists in this section" });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to add home category" });
  }
};


const getCategoryAdmin = async (req ,res)=>{

try{
 
const result = await pool.query(`SELECT * FROM home_categories  ; `)

res.json({categoryHome : result.rows})

}catch(err){
  console.error(err);
   res.status(500).json({ error: "Failed to fetch category Home" });
}


}

const toggleHomeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE home_categories
      SET 
        is_active = NOT is_active,
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, is_active
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Home category not found" });
    }

    res.json( {message : "Hero banner updated successfully" , categoryHome: result.rows[0]});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle home category" });
  }
};

const deleteHomeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM home_categories
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Home category not found" });
    }

    res.json({ message: "Home category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete home category" });
  }
};

module.exports = {
  addHomeCategory,
  toggleHomeCategory,
  deleteHomeCategory,
  getCategoryAdmin
};