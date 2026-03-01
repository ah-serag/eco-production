const express = require("express");
const controller = require("./paymob.controller");
const webhook = require("./paymob.webhook");
const authenticate = require("../../middleware/auth/authenticate")

const router = express.Router();

router.post("/checkout" ,authenticate, controller.checkout);
router.post("/checkoutWallet" ,authenticate, controller.checkoutWallet);
router.post("/checkoutCash" ,authenticate, controller.checkoutCash);
router.post("/webhook" , webhook.handleWebhook);

module.exports = router;