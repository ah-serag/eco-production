
const pool = require("../../config/condb");



const getHomePage = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.type, 
        s.order_index, 
        s.content AS info,
        CASE 
          WHEN s.type = 'hero' THEN (
            SELECT COALESCE(json_agg(h.*), '[]')
            FROM hero_banners h 
            WHERE h.section_id = s.id AND h.is_active = true
          )
          WHEN s.type = 'category' THEN (
            SELECT COALESCE(json_agg(c.*), '[]')
            FROM home_categories c 
            WHERE c.section_id = s.id AND c.is_active = true
          )
          WHEN s.type = 'product_category' THEN (
            SELECT COALESCE(json_agg(p.*), '[]')
            FROM (
              SELECT * FROM home_products hp 
              WHERE hp.section_id = s.id AND hp.is_active = true 
            ) p
          )
          WHEN s.type = 'Limited_Offer' THEN (
            SELECT COALESCE(json_agg(l.*), '[]')
            FROM limited_offer_banners l 
            WHERE l.section_id = s.id AND l.is_active = true
          )
          WHEN s.type = 'subcategory_banner' THEN (
            SELECT COALESCE(json_agg(sb.*), '[]')
            FROM subcategory_banners sb 
            WHERE sb.section_id = s.id AND sb.is_active = true
          )
          ELSE '[]'::json
        END AS content
      FROM home_sections s
      WHERE s.is_active = true
      ORDER BY s.order_index;
    `;

    const result = await pool.query(query);

    res.json({ sections: result.rows });

  } catch (error) {
    console.error("Error fetching homepage:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const searchProductscatAndSub = async (req, res) => {
  const { category, subcategory, page = 1, limit = 30, price_min, price_max, brand, rating } = req.query;

  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const parsedLimit = Math.min(parseInt(limit) || 12, 50);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const queryParams = [];
    let paramIndex = 1;

    let whereClause = `WHERE p.is_active = true`;

    if (category) {
      whereClause += ` AND p.category_id = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (subcategory) {
      const subcategories = subcategory.split(",").map(Number).filter(n => !isNaN(n));
      if (subcategories.length > 0) {
        whereClause += ` AND p.subcategory_id = ANY($${paramIndex})`;
        queryParams.push(subcategories);
        paramIndex++;
      }
    }

    if (price_min) {
      whereClause += ` AND p.price >= $${paramIndex}`;
      queryParams.push(price_min);
      paramIndex++;
    }
    if (price_max) {
      whereClause += ` AND p.price <= $${paramIndex}`;
      queryParams.push(price_max);
      paramIndex++;
    }

    if (brand) {
      const brands = brand.split(",").map(Number).filter(Boolean);
      if (brands.length > 0) {
        whereClause += ` AND p.brand = ANY($${paramIndex})`;
        queryParams.push(brands);
        paramIndex++;
      }
    }

    if (rating) {
      whereClause += ` AND p.rating >= $${paramIndex}`;
      queryParams.push(rating);
      paramIndex++;
    }

    const productsQuery = `
      SELECT
        p.*,
        c.name AS category,
        s.name AS subcategory,
        i.url AS image_url
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN subcategories s ON s.id = p.subcategory_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      LEFT JOIN images i ON i.id = pi.image_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      pool.query(productsQuery, [...queryParams, parsedLimit, offset]),
      pool.query(countQuery, queryParams),
    ]);

    const total = parseInt(countResult.rows[0]?.total || 0);

    res.json({
      success: true,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
      data: productsResult.rows,
    });

  } catch (error) {
    console.error("searchProductscatAndSub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};




// get products home only
const getProductCategory = async (req, res) => {
  const { categoryId } = req.params;

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);
  const offset = (page - 1) * limit;

  const { sub } = req.query; // optional: "1,2,3"

  try {
    const queryParams = [categoryId];
    let paramIndex = 2;

    let whereClause = `
      WHERE p.is_active = true
      AND p.category_id = $1
    `;

    // فلترة Subcategory (اختياري)
    if (sub) {
      const subArray = sub
        .split(",")
        .map(Number)
        .filter(Boolean);

      if (subArray.length) {
        whereClause += ` AND p.subcategory_id = ANY($${paramIndex})`;
        queryParams.push(subArray);
        paramIndex++;
      }
    }

    const productsQuery = `
      SELECT
        p.*,
        c.name AS category,
        s.name AS subcategory,
        i.url AS image_url
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN subcategories s ON s.id = p.subcategory_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      LEFT JOIN images i ON i.id = pi.image_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      pool.query(productsQuery, [...queryParams, limit, offset]),
      pool.query(countQuery, queryParams),
    ]);

    const total = parseInt(countResult.rows[0]?.total || 0);

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: productsResult.rows,
    });

  } catch (error) {
    console.error("getProductCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


const getProductsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  try {
    
    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM products p
      WHERE p.is_active = true
        AND p.subcategory_id = $1
      `,
      [subcategoryId]
    );

    const productsResult = await pool.query(
      `
      SELECT 
        p.*,
        c.name AS category,
        s.name AS subcategory,
        i.url AS image_url
      FROM products p
      JOIN categories c ON c.id = p.category_id
      JOIN subcategories s ON s.id = p.subcategory_id
      JOIN product_images pi 
        ON pi.product_id = p.id AND pi.is_main = true
      JOIN images i 
        ON i.id = pi.image_id
      WHERE p.is_active = true
        AND p.subcategory_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [subcategoryId, limit, offset]
    );

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit),
      },
      data: productsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by subcategory",
    });
  }
};



const filterCategory = async (req, res) => {

  const {categoryId} = req.query 


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
      WHERE c.id = $1
      GROUP BY c.id, c.name;
    `;

    const { rows } = await pool.query(query ,[categoryId]);
    
  
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



const CategoryAndSubcategoyOption = async (req, res) => {
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




const searchProducts = async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query; 
  const offset = (page - 1) * limit;

  try {
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    // 1. الاستعلام المتقدم - يستخدم Ranking لترتيب النتائج حسب الأهمية
    const productsResult = await pool.query(
      `
      WITH search_results AS (
        SELECT 
          p.*,
          c.name AS category,
          s.name AS subcategory,
          i.url AS image_url,
          ts_rank(
            setweight(to_tsvector('arabic', COALESCE(p.title, '')), 'A') || 
            setweight(to_tsvector('arabic', COALESCE(p.description, '')), 'B'),
            websearch_to_tsquery('arabic', $1)
          ) AS rank
        FROM products p
        JOIN categories c ON c.id = p.category_id
        JOIN subcategories s ON s.id = p.subcategory_id
        JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
        JOIN images i ON i.id = pi.image_id
        WHERE p.is_active = true
          AND (
            to_tsvector('arabic', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '')) 
            @@ websearch_to_tsquery('arabic', $1)
          )
      )
      SELECT *, COUNT(*) OVER() AS total_count
      FROM search_results
      ORDER BY rank DESC, created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [q, limit, offset]
    );

    const total = productsResult.rows.length > 0 ? parseInt(productsResult.rows[0].total_count) : 0;

    res.json({
      success: true,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: productsResult.rows.map(({ total_count, ...rest }) => rest), 
    });
  } catch (error) {
    console.error("Advanced Search Error:", error);
    res.status(500).json({ success: false, message: "Search operation failed" });
  }
};











module.exports = { 
getHomePage ,
getProductCategory ,
getProductsBySubcategory ,
CategoryAndSubcategoyOption ,
searchProducts ,
searchProductscatAndSub ,
filterCategory ,

};
