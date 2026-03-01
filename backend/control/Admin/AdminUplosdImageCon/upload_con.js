const cloudinary =  require("../../../config/cloudinary")
const pool = require("../../../config/condb");
const streamifier = require("streamifier"); 


exports.uploadImages = async (req, res) => {

  try {
   const files = req.files ;

    if (!files|| files.length === 0) throw new Error("No images uploaded");

    const uploadedImages = [];
    const queryImages = `SELECT add_image($1, $2) AS id`;


    for (let i = 0; i < req.files.length; i++) {
      const file = files[i];

      // > Cloudinary 
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            public_id: `${Date.now()}_${i}`,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });


     await pool.query( queryImages , [result.secure_url , result.public_id])

      uploadedImages.push(result.secure_url);
    }

    

    res.json({
      message: "Success upload images",
      images: uploadedImages,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed upload images" });
  }
};



exports.getImages = async (req, res) => {
  const { page = 1, limit = 10, sort = 'desc', search } = req.query;

  const client = await pool.connect();

  const _limit = Number(limit);
  const _page = Number(page);
  const offset = (_page - 1) * _limit;
  
  const searchValue = search || null; 

  try {

    
    const query = `
      SELECT 
           i.id AS image_id,
           i.url AS image_url,
           i.public_id,
           i.created_at,
           pi.product_id,
           pi.is_main,
           p.title AS product_title
       FROM images i
       LEFT JOIN product_images pi ON pi.image_id = i.id
       LEFT JOIN products p ON p.id = pi.product_id
       WHERE 
        ($1::text IS NULL OR p.title ILIKE '%' || $1 || '%')
       ORDER BY i.created_at ${sort === 'asc' ? 'ASC' : 'DESC'}
       LIMIT $2 OFFSET $3;
    `;
   
    const countQuery = `
      SELECT 
        COUNT(*) AS total
      FROM images i
      LEFT JOIN product_images pi ON pi.image_id = i.id
      LEFT JOIN products p ON p.id = pi.product_id
      WHERE 
        ($1::text IS NULL OR p.title ILIKE '%' || $1 || '%');
    `;

    const [result, countResult] = await Promise.all([
      client.query(query, [searchValue, _limit, offset]),
      client.query(countQuery, [searchValue])
    ]);

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / _limit);

    res.json({
      success: true,
      images: result.rows,
      total: total ,
      totalPages: totalPages 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
}



exports.deleteImage = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    await client.query("BEGIN");

    const imgRes = await client.query(
      "SELECT public_id FROM images WHERE id = $1",
      [id]
    );

    if (imgRes.rows.length === 0) {
      await client.query("ROLLBACK"); 
      return res.status(404).json({ 
        success: false, 
        message: "Image not found in our records" 
      });
    }

    const publicId = imgRes.rows[0].public_id;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await client.query("DELETE FROM product_images WHERE image_id = $1", [id]);
    await client.query("DELETE FROM images WHERE id = $1", [id]);

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Asset purged from cloud and local registry",
    });

  } catch (err) {
    if (client) await client.query("ROLLBACK");
    
    console.error("CRITICAL_ERROR in deleteImage:", err.message);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error during deletion" 
      });
    }
  } finally {
    client.release();
  }
};


