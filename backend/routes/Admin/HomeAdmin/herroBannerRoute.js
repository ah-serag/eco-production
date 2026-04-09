const express = require('express');
const router = express.Router();
const herroBannerControll = require("../../../control/Admin/HomeAdminCon/herroBanner_con");
const { handleFieldsUpload } = require("../../../config/multer");

const bannerUpload = handleFieldsUpload([
  { name: "desktop_image", maxCount: 1 },
  { name: "mobile_image",  maxCount: 1 },
]);

router.post("/admin/addHerobanner", bannerUpload, herroBannerControll.addHerobanner);
router.get("/admin/hero-banners", herroBannerControll.getHeroBanners);
router.patch("/admin/hero-banner/:id/toggle", herroBannerControll.toggleHeroBannerActive);
router.delete("/admin/hero-banner/:id", herroBannerControll.deleteHeroBanner);

module.exports = router;
