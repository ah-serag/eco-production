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

    const checkRes = await client.query(
      `SELECT i.public_id, pi.is_main 
       FROM images i
       LEFT JOIN product_images pi ON i.id = pi.image_id
       WHERE i.id = $1`,
      [id]
    );

    if (checkRes.rows.length === 0) {
      throw new Error("ERR_IMAGE_NOT_FOUND");
    }

    const { public_id, is_main } = checkRes.rows[0];

    if (is_main === true) {
      throw new Error("ERR_CANNOT_DELETE_MAIN_IMAGE");
    }

    await client.query("DELETE FROM product_images WHERE image_id = $1", [id]);
    const deleteRes = await client.query("DELETE FROM images WHERE id = $1", [id]);

    if (deleteRes.rowCount === 0) {
      throw new Error("ERR_DELETE_FAILED");
    }

    if (public_id) {
      const cloudRes = await cloudinary.uploader.destroy(public_id);
      if (cloudRes.result !== "ok" && cloudRes.result !== "not found") {
        console.warn(`Cloudinary warning for ID ${public_id}:`, cloudRes.result);
      }
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Image asset has been successfully purged from cloud and local registry.",
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CRITICAL_ERROR in deleteImage:", err.message);

    if (err.message === "ERR_CANNOT_DELETE_MAIN_IMAGE") {
      return res.status(400).json({
        success: false,
        error: "Action Denied",
        message: "You cannot delete main image"
      });
    }

    if (err.message === "ERR_IMAGE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested image could not be found in our records."
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred during the deletion process."
    });

  } finally {
    client.release();
  }
};

