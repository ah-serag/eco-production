const express = require('express');
const router = express.Router();
const  herroBannerControll = require("../../../control/Admin/HomeAdminCon/herroBanner_con");





router.post("/admin/addHerobanner" , herroBannerControll.addHerobanner)

router.get("/admin/hero-banners",herroBannerControll.getHeroBanners);
router.patch("/admin/hero-banner/:id/toggle", herroBannerControll.toggleHeroBannerActive);
router.delete("/admin/hero-banner/:id", herroBannerControll.deleteHeroBanner);







module.exports = router;
