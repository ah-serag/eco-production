const express = require("express");
const router = express.Router();

const limitedOfferBannerController = require(
  "../../../control/Admin/HomeAdminCon/limitedOferr_con"
);


router.post(
  "/admin/add-limited-offer-banner",
  limitedOfferBannerController.addLimitedOfferBanner
);

router.get(
  "/admin/limited-offer-banners",
  limitedOfferBannerController.getLimitedOfferBanners
);

router.patch(
  "/admin/limited-offer-banner/:id/toggle",
  limitedOfferBannerController.toggleLimitedOfferBannerActive
);

router.delete(
  "/admin/limited-offer-banner/:id",
  limitedOfferBannerController.deleteLimitedOfferBanner
);


router.get(
  "/limited-offer-banner/:section_id",
  limitedOfferBannerController.getActiveLimitedOfferBanner
);

module.exports = router;
