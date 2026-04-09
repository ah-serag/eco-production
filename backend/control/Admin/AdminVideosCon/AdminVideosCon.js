
const cloudinary =  require("../../../config/cloudinary")
const pool = require("../../../config/condb");
const streamifier = require("streamifier"); 



exports.uploadVideos = async (req, res) => {
  const files = req.files ;
  const client = await pool.connect();

  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Empty Payload",
        message: "No video files were detected. Please select at least one video to upload." 
      });
    }

    const uploadedResults = [];
    
    await client.query("BEGIN");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const cloudinaryResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products/videos",
            resource_type: "video",
            public_id: `vid_${Date.now()}_${i}`,
            chunk_size: 6000000, 
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      const dbQuery = `
        INSERT INTO videos (url, public_id) 
        VALUES ($1, $2) 
        RETURNING id
      `;
      
      const dbResult = await client.query(dbQuery, [
        cloudinaryResult.secure_url, 
        cloudinaryResult.public_id
      ]);

      uploadedResults.push({
        id: dbResult.rows[0].id,
        url: cloudinaryResult.secure_url
      });
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: `Asset Management: ${files.length} video(s) processed and secured successfully.`,
      videos: uploadedResults,
    });

  } catch (err) {
    if (client) await client.query("ROLLBACK");
     let friendlyMessage = "An unexpected error occurred while processing your videos.";
    return res.status(500).json({
      success: false,
      error: err.name || "UploadError",
      message: friendlyMessage,
    });

  } finally {
    client.release();
  }
};


exports.getVideos = async (req, res) => {
  const { page = 1, limit = 10, sort = 'desc', search } = req.query;

  const client = await pool.connect();

  const _limit = Number(limit);
  const _page = Number(page);
  const offset = (_page - 1) * _limit;
  
  const searchValue = search || null; 

  try {
    const query = `
      SELECT 
           v.id AS video_id,
           v.url AS video_url,
           v.public_id,
           v.created_at,
           pv.product_id,
           pv.is_main,
           p.title AS product_title
       FROM videos v
       LEFT JOIN product_videos pv ON pv.video_id = v.id
       LEFT JOIN products p ON p.id = pv.product_id
       WHERE 
         ($1::text IS NULL OR p.title ILIKE '%' || $1 || '%')
       ORDER BY v.created_at ${sort === 'asc' ? 'ASC' : 'DESC'}
       LIMIT $2 OFFSET $3;
    `;
   
    const countQuery = `
      SELECT 
        COUNT(*) AS total
      FROM videos v
      LEFT JOIN product_videos pv ON pv.video_id = v.id
      LEFT JOIN products p ON p.id = pv.product_id
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
      videos: result.rows, 
      total: total,
      totalPages: totalPages 
    });

  } catch (err) {
    console.error("Error in getVideos:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};




exports.deleteVideo = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    await client.query("BEGIN");

    const checkRes = await client.query(
      `SELECT v.public_id, pv.is_main 
       FROM videos v
       LEFT JOIN product_videos pv ON v.id = pv.video_id
       WHERE v.id = $1`,
      [id]
    );

    if (checkRes.rows.length === 0) {
      throw new Error("ERR_VIDEO_NOT_FOUND");
    }

    const { public_id, is_main } = checkRes.rows[0];

    if (is_main === true) {
      throw new Error("ERR_CANNOT_DELETE_MAIN_VIDEO");
    }

    await client.query("DELETE FROM product_videos WHERE video_id = $1", [id]);
    
    const deleteRes = await client.query("DELETE FROM videos WHERE id = $1", [id]);

    if (deleteRes.rowCount === 0) {
      throw new Error("ERR_DELETE_FAILED");
    }

    if (public_id) {
      const cloudRes = await cloudinary.uploader.destroy(public_id, { 
        resource_type: "video" 
      });
      
      if (cloudRes.result !== "ok" && cloudRes.result !== "not found") {
        console.warn(`Cloudinary warning for Video ID ${public_id}:`, cloudRes.result);
      }
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Video asset has been successfully purged from cloud and local registry.",
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CRITICAL_ERROR in deleteVideo:", err.message);

    if (err.message === "ERR_CANNOT_DELETE_MAIN_VIDEO") {
      return res.status(400).json({
        success: false,
        error: "Action Denied",
        message: "You cannot delete the main video of a product."
      });
    }

    if (err.message === "ERR_VIDEO_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested video could not be found in our records."
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred during the video deletion process."
    });

  } finally {
    client.release();
  }
};