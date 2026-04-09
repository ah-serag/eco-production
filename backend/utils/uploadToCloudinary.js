const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} folder     - Cloudinary folder path (e.g. "products/images")
 * @param {string} type       - Resource type: "image" | "video" (default: "image")
 * @param {string} [publicId] - Optional custom public_id
 * @returns {Promise<object>} Cloudinary upload result (secure_url, public_id, ...)
 */
const uploadToCloudinary = (fileBuffer, folder, type = "image", publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: type,
        public_id: publicId || `${Date.now()}_${Math.random()}`,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
