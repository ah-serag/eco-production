const express = require("express");
const controller = require("./paymob.controller");
const webhook = require("./paymob.webhook");
const dataBillingUser =require("../../control/checkoutPage/dataBillingUser")
const authenticateCheckout = require("../../middleware/checkout/authenticateCheckout")
const limit = require("express-rate-limit")
const {validatebody} = require("../../middleware/validateZod/validateZod")
const {checkout_Card_Schema , checkout_Wallet_Schema} = require("../../utils/zodShemas")





const router = express.Router();



const limitCheckout = limit.rateLimit({
 windowMs: 5 * 60 * 1000,
  max: 13 ,
  message : "Please try again after 5 minutes."
})




router.post("/checkout" , validatebody(checkout_Card_Schema  ) , limitCheckout , authenticateCheckout , controller.checkout);
router.post("/checkoutWallet" ,validatebody(checkout_Wallet_Schema ) , limitCheckout,authenticateCheckout , controller.checkoutWallet);
router.post("/checkoutCash" ,validatebody(checkout_Card_Schema ,) , limitCheckout ,authenticateCheckout , controller.checkoutCash);
router.post("/webhook"  , webhook.handleWebhook);
router.get("/dataBillingUser/:userid" ,dataBillingUser.getBillingDataUser )
router.post("/check-Coupons" , controller.checkCoupons );





module.exports = router;