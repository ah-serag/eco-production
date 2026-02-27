const express = require('express');
const router = express.Router();
const { getOrders, getOrderItems  , getAllOrderItems} = require('../../../control/Admin/orders/orders_con');
const authenticate = require("../../../middleware/auth/authenticate")
const attachUser = require("../../../middleware/auth/atachUser")
const auhtorize = require("../../../middleware/auth/authorize")


router.get('/orders' , authenticate,attachUser,auhtorize( "admin","Super Admin") ,  getOrders);
router.get('/orders-items',authenticate,attachUser,auhtorize( "admin","Super Admin") ,  getAllOrderItems);
router.get('/orders/:order_id/items',authenticate,attachUser,auhtorize( "admin","Super Admin") , getOrderItems);

module.exports = router;