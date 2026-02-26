
const pool = require("../../../config/condb");



const getCategory = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM category_full ;");
    return res.json(result.rows); 
  } catch (err) {
    console.error("Failed to get products:", err.message);
    return res.status(500).json({ message: "Failed to get Category" });
  }
};

const getCategoryOptions = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id ,
        name 
      FROM categories
      ORDER BY name ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch category options",
    });
  }
};

const getSubcategoryOptions = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name
      FROM subcategories
      ORDER BY name ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch subcategory options",
    });
  }
};


 const addCategories = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Category name is required" });

  try {
    const existing = await pool.query(
      "SELECT * FROM categories WHERE LOWER(name) = LOWER($1)",
      [name]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) ",
      [name]
    );

    res.status(201).json({ message: "Category added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


 const addSubcategories = async (req, res) => {
  const { name, category_id } = req.body;

  if (!name || !category_id)
    return res.status(400).json({ message: "Subcategory name and category_id are required" });

  try {
    //  category
    const category = await pool.query("SELECT * FROM categories WHERE id = $1", [category_id]);
    if (category.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    //  category not duplication in subcategory is same name 
    const existing = await pool.query(
      "SELECT * FROM subcategories WHERE LOWER(name) = LOWER($1) AND category_id = $2",
      [name, category_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Subcategory already exists in this category" });
    }

    const result = await pool.query(
      "INSERT INTO subcategories (name, category_id) VALUES ($1, $2)",
      [name, category_id]
    );

    res
      .status(201)
      .json({ message: "Subcategory added successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getCategoryAndSubAdmin = async (req, res) => {

  try {
    const query = `
      SELECT 
        c.id AS category_id, 
        c.name AS category_name,
        json_agg(
          json_build_object('id', s.id, 'name', s.name)
        ) FILTER (WHERE s.id IS NOT NULL) AS items
      FROM categories c
      LEFT JOIN subcategories s ON c.id = s.category_id
      GROUP BY c.id, c.name
      ORDER BY c.name ASC;
    `;

    const { rows } = await pool.query(query);
    
  
    const result = rows.map(row => ({
      id: row.category_id,
      categoryName: row.category_name,
      items: row.items || [] 
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const deleteCategory = async (req, res) => {
  const { id } = req.params; 

  try {
    const checkCategory = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    
    if (checkCategory.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    await pool.query("DELETE FROM categories WHERE id = $1", [id]);

    res.status(200).json({ 
      message: "Category and all its subcategories deleted successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const deleteSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const checkSub = await pool.query("SELECT * FROM subcategories WHERE id = $1", [id]);
    
    if (checkSub.rows.length === 0) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await pool.query("DELETE FROM subcategories WHERE id = $1", [id]);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = {getCategory ,addCategories , deleteCategory ,deleteSubcategory, addSubcategories  , getCategoryOptions ,getSubcategoryOptions ,getCategoryAndSubAdmin}













