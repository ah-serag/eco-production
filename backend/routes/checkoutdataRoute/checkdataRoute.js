const express = require('express');
const router = express.Router();
const authenticateCheckout = require("../../middleware/checkout/authenticateCheckout")
const checkoutdata = require("../../control/checkoutPage/dataBillingUser")




router.get("/user-billingdata" ,  authenticateCheckout ,checkoutdata.getBillingDataUser )



module.exports = router;
