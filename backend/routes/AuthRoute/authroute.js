const express = require('express');
const router = express.Router();
const authControll  = require("../../control/auth/auth_con")

router.post("/register" , authControll.register)
router.post("/sign_in" ,authControll.sign_in )
router.get("/refresh" ,authControll.refresh )
router.post("/logout" , authControll.logOut)

module.exports = router