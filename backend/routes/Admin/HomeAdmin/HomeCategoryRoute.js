const express = require("express");
const router = express.Router();
const homeCategoriesControll = require("../../../control/Admin/HomeAdminCon/homeCategory_con");

// add
router.post("/admin/addHomeCategory", homeCategoriesControll.addHomeCategory);

// read + category
router.get("/admin/getCategoryHomeAdmin", homeCategoriesControll.getCategoryAdmin);
router.patch("/admin/:id/toggle", homeCategoriesControll.toggleHomeCategory);
router.delete("/admin/:id", homeCategoriesControll.deleteHomeCategory);







module.exports = router;
