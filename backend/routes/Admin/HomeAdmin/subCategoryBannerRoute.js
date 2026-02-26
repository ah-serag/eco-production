const express = require('express');
const router = express.Router();
const  subCategoryBanner = require("../../../control/Admin/HomeAdminCon/subCategoryBanner_con");




router.post("/admin/subcategory-banner", subCategoryBanner.addSubcategoryBanner);
router.get("/admin/subcategory-banners", subCategoryBanner.getSubcategoryBanners);
router.patch("/admin/subcategory-banners/:id/toggle", subCategoryBanner.toggleSubcategoryBannerActive);
router.delete("/admin/subcategory-banners/:id", subCategoryBanner.deleteSubcategoryBanner);





module.exports = router;
