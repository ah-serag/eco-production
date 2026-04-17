const express = require("express");
const router = express.Router();
const couponsControll = require("../../../control/Admin/AdminCouponsCon/coupons_con");
const authenticate = require("../../../middleware/auth/authenticate");
const attachUser = require("../../../middleware/auth/atachUser");
const authorize = require("../../../middleware/auth/authorize");

const guard = [authenticate, attachUser, authorize("admin", "Super Admin")];

router.get("/",           ...guard, couponsControll.getCoupons);
router.post("/",          ...guard, couponsControll.addCoupon);
router.delete("/:id",     ...guard, couponsControll.deleteCoupon);
router.patch("/:id",      ...guard, couponsControll.toggleCouponStatus);

module.exports = router;
