const pool = require('../../config/condb'); 

const getProductBySlug = async (req, res) => {
    const { slug } = req.params;


    try {
        const query = `
            SELECT 
                p.*, 
                c.name AS category_name, 
                s.name AS subcategory_name,
                (
                    SELECT json_agg(
                        json_build_object(
                            'url', i.url,
                            'is_main', pi.is_main
                        ) 
                        ORDER BY pi.is_main DESC, pi.position ASC
                    )
                    FROM product_images pi
                    JOIN images i ON i.id = pi.image_id
                    WHERE pi.product_id = p.id
                ) AS images_list
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE p.slug = $1 AND p.is_active = TRUE
        `;

        const result = await pool.query(query, [slug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "المنتج غير موجود" 
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "خطأ في السيرفر" 
        });
    }
};

module.exports = { getProductBySlug };