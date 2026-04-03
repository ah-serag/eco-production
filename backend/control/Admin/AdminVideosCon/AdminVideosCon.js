
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