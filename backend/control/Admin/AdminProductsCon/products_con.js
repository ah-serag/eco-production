

const pool = require("../../../config/condb");
const cloudinary = require("../../../config/cloudinary");
const streamifier = require("streamifier");
const parseExcel = require("../../../utils/parseExcel")





const getProductsAdmin = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    status,
    category_id,
    search,
    sort_by = "created_at",
  } = req.query;

  const _limit = Math.max(Number(limit), 1);
  const _page = Math.max(Number(page), 1);
  const offset = (_page - 1) * _limit;

  try {
    const validSortColumns = ["price", "created_at"];
    let sortColumn = validSortColumns.includes(sort_by) ? sort_by : "created_at";
    let sortOrder = "DESC"; 
    if (sort_by === "oldest") {
      sortColumn = "created_at";
      sortOrder = "ASC";
    }

   
    const filterParams = [
      status || null,
      category_id ? Number(category_id) : null,
      search || null
    ];

    const whereClause = `
      WHERE ($1::text IS NULL OR p.is_active = ($1 = 'active'))
        AND ($2::int IS NULL OR p.category_id = $2)
        AND ($3::text IS NULL OR p.title ILIKE '%' || $3 || '%')
    `;

    const dataQuery = `
      SELECT 
          p.id,
          p.title,
          p.price,
          p.stock,
          p.description,
          p.discount_price,
          p.is_active,
          p.created_at,
          p.slug,
          i.url AS image_url
      FROM products p
      LEFT JOIN product_images pi 
            ON pi.product_id = p.id AND pi.is_main = true
      LEFT JOIN images i 
            ON i.id = pi.image_id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $4 OFFSET $5
    `;

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM products p
      ${whereClause}
    `;

    const [result, countResult] = await Promise.all([
      pool.query(dataQuery, [...filterParams, _limit, offset]),
      pool.query(countQuery, filterParams)
    ]);

    const total = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(total / _limit);

    res.json({
      success: true,
      page: _page,
      limit: _limit,
      total,
      totalPages,
      products: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const toggleActive = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE products SET is_active = NOT is_active WHERE id = $1 RETURNING id, is_active",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: `Product is now ${result.rows[0].is_active ? "active" : "inactive"}`,
      product: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



const editProduct = async (req, res) => {
  const { id } = req.params;
  const { title, price, stock, description , discount_price } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET title = $1, price = $2, stock = $3, description = $4 , discount_price = $5
       WHERE id = $6
       RETURNING *`,
      [title, price, stock, description ,discount_price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderCheck = await client.query(
      "SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1",
      [id]
    );

    if (orderCheck.rowCount > 0) {
      throw new Error("ERR_PRODUCT_HAS_ORDERS");
    }
  

  
    const imagesQuery = await client.query(
      `SELECT i.public_id, i.id 
       FROM images i
       JOIN product_images pi ON i.id = pi.image_id
       WHERE pi.product_id = $1`,
      [id]
    );
    


    const publicIdsToDelete = imagesQuery.rows.map(row => row.public_id);
    const imageIds = imagesQuery.rows.map(row => row.id);

    await client.query("DELETE FROM product_images WHERE product_id = $1", [id]);

    const productDeleteResult = await client.query("DELETE FROM products WHERE id = $1", [id]);

    if (productDeleteResult.rowCount === 0) {
      throw new Error("ERR_PRODUCT_NOT_FOUND");
    }

    // 6. Delete from main images table
    if (imageIds.length > 0) {
      await client.query("DELETE FROM images WHERE images.id = ANY($1)", [imageIds]);
    }

    // 7. Commit changes to Database
    await client.query("COMMIT");

    // 8. Cleanup Cloudinary assets (After DB success)
    if (publicIdsToDelete.length > 0) {
      const cloudinaryDeletions = publicIdsToDelete.map(publicId => 
        cloudinary.uploader.destroy(publicId)
      );
      await Promise.all(cloudinaryDeletions);
    }

    res.status(200).json({ 
      success: true, 
      message: "Product and all related assets have been permanently deleted." 
    });

  } catch (err) {
    await client.query("ROLLBACK");
    
    console.error("Deletion Process Error:", err.message);

    if (err.message === "ERR_PRODUCT_HAS_ORDERS") {
      return res.status(409).json({ 
        success: false,
        error: "Integrity Violation",
        message: "Cannot delete product: It is linked to existing customer orders. " 
      });
    }

    if (err.message === "ERR_PRODUCT_NOT_FOUND") {
      return res.status(404).json({ 
        success: false,
        error: "Not Found",
        message: "The requested product does not exist in our records." 
      });
    }

    // Generic Internal Server Error
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred while deleting the product. Please try again later." 
    });

  } finally {
    // Release client back to the pool
    client.release();
  }
};







// const addProductWithImages = async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const {
//       title, title_ar, slug, description, description_ar, price, 
//       discount_price, stock, sku, brand, weight, length, width, 
//       height, category_id, subcategory_id, is_active
//     } = req.body;

//     const slugCheck = await client.query("SELECT 1 FROM products WHERE slug = $1 LIMIT 1", [slug]);
//     if (slugCheck.rowCount > 0) {
//       return res.status(400).json({ message: "Slug already exists. Please use a unique title." });
//     }

//     if (!req.files?.mainImage || req.files.mainImage.length === 0) {
//       throw new Error("Main image is required");
//     }

//     await client.query("BEGIN");

//     const queryProduct = `
//       SELECT add_product($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) AS product_id
//     `;

//     const valuesProduct = [
//       title, title_ar, slug, price, description, description_ar, 
//       discount_price, stock, sku, brand, weight, length, width, 
//       height, category_id, subcategory_id, is_active
//     ];

//     const result = await client.query(queryProduct, valuesProduct);
//     const productId = result.rows[0].product_id;

//     if(req?.user.role == "vendor"){
//       await client.query(`INSERT INTO vendors_products (product_id, vendor_id)
//         VALUES ($1, $2)`, [productId ,req.user.id])
//     }

//     const queryImages = `SELECT add_image($1, $2) AS id`;
//     const mainImageFile = req.files?.mainImage?.[0] ?? null;
//     const galleryFiles = req.files?.gallery ?? [];

//     const mainResult = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "products", public_id: `${productId}_main_${Date.now()}` },
//         (err, result) => (err ? reject(err) : resolve(result))
//       );
//       streamifier.createReadStream(mainImageFile.buffer).pipe(stream);
//     });

//     const addMainImage = await client.query(queryImages , [mainResult.secure_url , mainResult.public_id])

//     await client.query(
//       `INSERT INTO product_images (product_id, image_id, is_main, position)
//        VALUES ($1, $2, true, 0)`,
//       [productId, addMainImage.rows[0].id]
//     );

//     for (let i = 0; i < galleryFiles.length; i++) {
//       const file = galleryFiles[i];
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "products", public_id: `${productId}_gallery_${Date.now()}_${i}` },
//           (err, result) => (err ? reject(err) : resolve(result))
//         );
//         streamifier.createReadStream(file.buffer).pipe(stream);
//       });
      
//       const addImages = await client.query(queryImages, [uploadResult.secure_url , uploadResult.public_id]);
    
//       await client.query(
//         `INSERT INTO product_images (product_id, image_id, is_main, position)
//          VALUES ($1, $2, false, $3)`,
//         [productId, addImages.rows[0].id, i + 1]
//       );
//     }

//     await client.query("COMMIT");
//     res.status(201).json({ message: "Product added successfully", product_id: productId });
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error(err);
//     res.status(500).json({ message: err.message || "Failed to add product" });
//   } finally {
//     client.release();
//   }
// };


const addProductWithImages = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      title, title_ar, slug, description, description_ar, price, 
      discount_price, stock, sku, brand, weight, length, width, 
      height, category_id, subcategory_id, is_active
    } = req.body;

    // --- Slug unique check ---
    const slugCheck = await client.query("SELECT 1 FROM products WHERE slug = $1 LIMIT 1", [slug]);
    if (slugCheck.rowCount > 0) {
      return res.status(400).json({ message: "Slug already exists." });
    }

    // --- Validate main image ---
    if (!req.files?.mainImage) {
      throw new Error("Main image is required");
    }

    await client.query("BEGIN");

    // --- Add basic product info ---
    const result = await client.query(
      `SELECT add_product($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) AS product_id`,
      [title, title_ar, slug, price, description, description_ar, discount_price, stock, sku, brand, weight, length, width, height, category_id, subcategory_id, is_active]
    );
    const productId = result.rows[0].product_id;

    // --- Vendor link ---
    if (req?.user.role == "vendor") {
      await client.query(`INSERT INTO vendors_products (product_id, vendor_id) VALUES ($1, $2)`, [productId, req.user.id]);
    }

    // --- Helper function for Cloudinary upload ---
    const uploadToCloudinary = (fileBuffer, folder, type = "image") => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: type, public_id: `${productId}_${Date.now()}_${Math.random()}` },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // --- Handle Images ---
    const mainImg = req.files.mainImage[0];
    const gallery = req.files.gallery || [];
    
    // Upload main image
    const mainImgRes = await uploadToCloudinary(mainImg.buffer, "products/images");
    const addImgDb = await client.query(`SELECT add_image($1, $2) AS id`, [mainImgRes.secure_url, mainImgRes.public_id]);
    await client.query(`INSERT INTO product_images (product_id, image_id, is_main, position) VALUES ($1, $2, true, 0)`, [productId, addImgDb.rows[0].id]);

    // Upload gallery
    for (let i = 0; i < gallery.length; i++) {
      const res = await uploadToCloudinary(gallery[i].buffer, "products/images");
      const dbImg = await client.query(`SELECT add_image($1, $2) AS id`, [res.secure_url, res.public_id]);
      await client.query(`INSERT INTO product_images (product_id, image_id, is_main, position) VALUES ($1, $2, false, $3)`, [productId, dbImg.rows[0].id, i + 1]);
    }

    // --- Handle Videos ---
    const mainVid = req.files.mainVideo?.[0];
    const vidGallery = req.files.videoGallery || [];

    // Upload main video
    if (mainVid) {
      const mainVidRes = await uploadToCloudinary(mainVid.buffer, "products/videos", "video");
      const addVidDb = await client.query(`INSERT INTO videos (url, public_id) VALUES ($1, $2) RETURNING id`, [mainVidRes.secure_url, mainVidRes.public_id]);
      await client.query(`INSERT INTO product_videos (product_id, video_id, is_main) VALUES ($1, $2, true)`, [productId, addVidDb.rows[0].id]);
    }

    // Upload video gallery
    for (const vidFile of vidGallery) {
      const res = await uploadToCloudinary(vidFile.buffer, "products/videos", "video");
      const dbVid = await client.query(`INSERT INTO videos (url, public_id) VALUES ($1, $2) RETURNING id`, [res.secure_url, res.public_id]);
      await client.query(`INSERT INTO product_videos (product_id, video_id, is_main) VALUES ($1, $2, false)`, [productId, dbVid.rows[0].id]);
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Product created with all media", product_id: productId });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const addProductsFromExcel = async (req, res) => {
  let client;

  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const resultExcel = parseExcel(file.buffer);

    client = await pool.connect();
    await client.query("BEGIN");

    for (let i = 0; i < resultExcel.length; i++) {
      const {
        title, slug, description, price, discount_price, stock,
        sku, brand, weight, length, width, height,
         subcategory, is_active,
        mainImage, images
      } = resultExcel[i];

    
     // get category id and subcategory id 
     const categoryAndSubIds = await client.query(`SELECT id as subcategory_id , category_id FROM subcategories WHERE LOWER(subcategories.name) = LOWER($1)` ,[subcategory])
     const {category_id , subcategory_id} = categoryAndSubIds.rows[0] ;
    // add product
      const valuesProduct = [
        title, slug, price, description, discount_price, stock, sku, brand,
        weight, length, width, height,category_id,subcategory_id, is_active
      ];

      const queryProduct = ` 
        SELECT add_product(
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
        ) AS product_id
      `;

      const productRes = await client.query(queryProduct, valuesProduct);
      const productId = productRes.rows[0].product_id;

      // parse images
      const mainImageUrl = mainImage?.trim();
      const imagesUrl =
        images?.split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0) || [];

      // main image id
      const mainImgRes = await client.query(
        "SELECT id FROM images WHERE url = $1",
        [mainImageUrl]
      );

      const mainImageId = mainImgRes.rows[0]?.id;

      if (!mainImageId) {
        throw new Error(`Main image not found in images table: ${mainImageUrl}`);
      }

      // insert main image
      await client.query(
        `INSERT INTO product_images (product_id, image_id, is_main, position)
         VALUES ($1, $2, true, 0)`,
        [productId, mainImageId]
      );

      // other images
      let pos = 1;
      for (const url of imagesUrl) {
        const imgRes = await client.query(
          "SELECT id FROM images WHERE url = $1",
          [url]
        );

        if (!imgRes.rows[0]) {
          console.log("Image not found:", url);
          continue;
        }

        await client.query(
          `INSERT INTO product_images (product_id, image_id, is_main, position)
           VALUES ($1, $2, false, $3)`,
          [productId, imgRes.rows[0].id, pos]
        );
        pos++;
      }
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Products with images added successfully",
    });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: err.message || "Failed to add products" });
  } finally {
    if (client) client.release();
  }
};



const addProductFromAI = async (req, res) => {
  let client;

  try {
    const {
      title,
      slug,
      description,
      price,
      discount_price,
      stock,
      sku,
      brand,
      weight,
      length,
      width,
      height,
      category_id,
      subcategory_id,
      is_active,
      mainImage,
      images = []
    } = req.body;

    // validation بسيط
    if (!title || !price || !category_id || !mainImage) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    // 🔹 add product مباشرة
    const valuesProduct = [
      title,
      slug,
      price,
      description,
      discount_price,
      stock,
      sku,
      brand,
      weight,
      length,
      width,
      height,
      category_id,
      subcategory_id,
      is_active
    ];

    const queryProduct = `
      SELECT add_product(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      ) AS product_id
    `;

    const productRes = await client.query(queryProduct, valuesProduct);
    const productId = productRes.rows[0].product_id;

    // 🔹 main image
    const mainImgRes = await client.query(
      "SELECT id FROM images WHERE url = $1",
      [mainImage]
    );

    if (!mainImgRes.rows.length) {
      throw new Error(`Main image not found: ${mainImage}`);
    }

    await client.query(
      `INSERT INTO product_images (product_id, image_id, is_main, position)
       VALUES ($1, $2, true, 0)`,
      [productId, mainImgRes.rows[0].id]
    );

    // 🔹 other images
    let position = 1;
    for (const url of images) {
      const imgRes = await client.query(
        "SELECT id FROM images WHERE url = $1",
        [url]
      );

      if (!imgRes.rows.length) continue;

      await client.query(
        `INSERT INTO product_images (product_id, image_id, is_main, position)
         VALUES ($1, $2, false, $3)`,
        [productId, imgRes.rows[0].id, position]
      );

      position++;
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      product_id: productId
    });

  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message || "Failed to add product"
    });
  } finally {
    if (client) client.release();
  }
};













module.exports = {  
   addProductWithImages , addProductsFromExcel 
  , getProductsAdmin ,toggleActive , editProduct ,deleteProduct , addProductFromAI };




