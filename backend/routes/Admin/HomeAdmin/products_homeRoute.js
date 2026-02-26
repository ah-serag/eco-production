
const express = require("express");
const router = express.Router();

const homeProductsController = require(
  "../../../control/Admin/HomeAdminCon/productHome_con"
);


router.post(
  "/admin/home-products",
  homeProductsController.addHomeProduct
);


module.exports = router;
