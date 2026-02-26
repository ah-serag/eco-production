
 const pool = require("../../../config/condb");






const getProductsvendors = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    status,
    category_id,
    search,
    sort_by = "created_at",
  } = req.query;

  const _limit = Number(limit);
  const _page = Number(page);
  const offset = (_page - 1) * _limit;

  try {
    const validSortColumns = ["price", "created_at"];
    let sortColumn = validSortColumns.includes(sort_by) ? sort_by : "created_at";
    let sortOrder = "DESC";

    if (sort_by === "oldest") {
      sortColumn = "created_at";
      sortOrder = "ASC";
    }

    const result = await pool.query(
      `SELECT 
          p.*,
          i.url AS image_url
       FROM vendors_products vp
       LEFT JOIN products p ON vp.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
       LEFT JOIN images i ON i.id = pi.image_id
       WHERE vp.vendor_id = $1
         AND ($2::text IS NULL OR p.is_active = ($2 = 'active'))
         AND ($3::int IS NULL OR p.category_id = $3)
         AND ($4::text IS NULL OR p.title ILIKE '%' || $4 || '%')
       ORDER BY ${sortColumn} ${sortOrder}
       LIMIT $5 OFFSET $6`,
      [req.user.id, status, category_id, search, _limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) 
       FROM vendors_products vp
       LEFT JOIN products p ON vp.product_id = p.id
       WHERE vp.vendor_id = $1
         AND ($2::text IS NULL OR p.is_active = ($2 = 'active'))
         AND ($3::int IS NULL OR p.category_id = $3)
         AND ($4::text IS NULL OR p.title ILIKE '%' || $4 || '%')`,
      [req.user.id, status, category_id, search]
    );

    const total = Number(countResult.rows[0].count);

    res.json({
      page: _page,
      limit: _limit,
      total,
      products: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getProductsAndVendorsAdmin = async (req , res)=>{

const {page = 1 ,limit = 10 ,search ,status} = req.query ;

  const _limit = Number(limit);
  const _page = Number(page);
  const offset = (_page - 1) * _limit;


try{


    const result = await pool.query(
      `SELECT 
          p.*,
          i.url AS image_url ,
          users.email 
       FROM vendors_products vp
       LEFT JOIN products p ON vp.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
       LEFT JOIN images i ON i.id = pi.image_id
       LEFT JOIN users  ON users.id = vp.vendor_id 
       WHERE ($1::text IS NULL OR p.is_active = ($1 = 'active'))
         AND ($2::text IS NULL OR users.email ILIKE '%' || $2 || '%')
       LIMIT $3 OFFSET $4`,
      [status, search, _limit, offset]
    );


    const countResult = await pool.query(
      `SELECT COUNT(*) FROM vendors_products vp
        LEFT JOIN  users  ON vp.vendor_id = users.id
        LEFT JOIN products p ON vp.product_id = p.id
       WHERE ($1::text IS NULL OR p.is_active = ($1 = 'active'))
         AND ($2::text IS NULL OR users.email ILIKE '%' || $2 || '%') ;
      `
       ,
      [status , search]
    )

   const total = Number(countResult.rows[0].count);


   res.json({
    page: _page,
    limit: _limit,
    total,
    productsVendors: result.rows
   })



}catch (err){
    console.error(err);
    res.status(500).json({ message: err.message });
}



}

module.exports = {getProductsvendors ,getProductsAndVendorsAdmin}