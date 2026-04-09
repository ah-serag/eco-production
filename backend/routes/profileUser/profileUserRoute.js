const express = require('express');
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const { getProfile, updateAccount, updateBilling } = require("../../control/profileUser/profileUserCon");

router.get("/",              authenticate, getProfile);
router.patch("/account",     authenticate, updateAccount);
router.patch("/billing",     authenticate, updateBilling);

module.exports = router;
