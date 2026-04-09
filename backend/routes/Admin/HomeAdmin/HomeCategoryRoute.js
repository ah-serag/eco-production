const express = require("express");
const router = express.Router();
const homeCategoriesControll = require("../../../control/Admin/HomeAdminCon/homeCategory_con");
const { handleImageUpload } = require("../../../config/multer");

router.post("/admin/addHomeCategory", handleImageUpload("image", 1), homeCategoriesControll.addHomeCategory);
router.get("/admin/getCategoryHomeAdmin", homeCategoriesControll.getCategoryAdmin);
router.patch("/admin/:id/toggle", homeCategoriesControll.toggleHomeCategory);
router.delete("/admin/:id", homeCategoriesControll.deleteHomeCategory);

module.exports = router;
