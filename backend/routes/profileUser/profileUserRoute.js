const express = require('express');
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const { getProfile, updateAccount, updateBilling } = require("../../control/profileUser/profileUserCon");
const {validatebody} = require("../../middleware/validateZod/validateZod")
const {billingSchema ,edeitAccountschema} = require("../../utils/zodShemas")


router.get("/",              authenticate, getProfile);
router.patch("/account",  validatebody(edeitAccountschema) ,   authenticate, updateAccount);
router.patch("/billing",validatebody(billingSchema) , authenticate, updateBilling);

module.exports = router;
