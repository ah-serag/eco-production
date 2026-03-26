const express = require("express");
const controller = require("./paymob.controller");
const webhook = require("./paymob.webhook");
const dataBillingUser =require("../../control/checkoutPage/dataBillingUser")
const authenticateCheckout = require("../../middleware/checkout/authenticateCheckout")
const router = express.Router();

router.post("/checkout" , authenticateCheckout , controller.checkout);
router.post("/checkoutWallet" , controller.checkoutWallet);
router.post("/checkoutCash" , controller.checkoutCash);
router.post("/webhook" , webhook.handleWebhook);
router.get("/dataBillingUser/:userid" ,dataBillingUser.getBillingDataUser )


module.exports = router;