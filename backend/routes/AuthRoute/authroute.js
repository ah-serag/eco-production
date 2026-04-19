const express = require('express');
const router = express.Router();
const authControll  = require("../../control/auth/auth_con")
const limit = require("express-rate-limit")

const limitAuthSignIn = limit.rateLimit({
  windowMs : 5 * 60 * 1000 ,
  max : 12 ,
  message : "Please try again after 10 minutes."
})

const limitAuthRegister = limit.rateLimit({
  windowMs : 5 * 60 * 1000 ,
  max : 10 ,
  message : "Please try again after 15 minutes."
})

router.post("/register" ,limitAuthRegister,  authControll.register)
router.post("/sign_in" , limitAuthSignIn ,authControll.sign_in )
router.get("/refresh" ,authControll.refresh )
router.post("/logout" , authControll.logOut)

module.exports = router