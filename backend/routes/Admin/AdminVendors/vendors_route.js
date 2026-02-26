const express = require('express');
const router = express.Router();
const vendorsControll  =require("../../../control/Admin/AdminVendorsCon/vendors_con")
const authenticate = require("../../../middleware/auth/authenticate")
const attachUser = require("../../../middleware/auth/atachUser")
const auhtorize = require("../../../middleware/auth/authorize")

router.get("/getProductsVendor" ,authenticate,attachUser,auhtorize("vendor") , vendorsControll.getProductsvendors)
router.get("/getProductsAndVendorsAdmin" ,authenticate,attachUser,auhtorize( "admin","Super Admin") , vendorsControll.getProductsAndVendorsAdmin)





module.exports = router