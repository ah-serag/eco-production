const express = require('express');
const router = express.Router();
const clientOrdersControll = require("../../control/ordersClient/ordersClientCon")
const authenticate = require("../../middleware/auth/authenticate")


router.get("/getClientOrders" , authenticate ,clientOrdersControll.getClientOrders)



module.exports = router;
