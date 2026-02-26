const express = require('express');
const router = express.Router();
const homeClientControll  = require("../../control/home/homeClient_con")
const homeUsersControll  = require("../../control/home/homeUser_con")
const catagoryControll = require("../../control/Admin/AdminCategoryCon/category_con")
const authenticate = require("../../middleware/auth/authenticate")


router.get("/getHomePage" , homeClientControll.getHomePage)
router.get("/getCategoryOption" , catagoryControll.getCategoryOptions)

// product search 
router.get("/products/search", homeClientControll.searchProducts)

// filter route 
router.get("/getFilterCategorys", homeClientControll.filterCategory)




// searc product sub and category 
router.get("/searchProductscatAndSub" , homeClientControll.searchProductscatAndSub)


// get products home only 
router.get("/ProductCategory/:categoryId/:subcategoryId" , homeClientControll.getProductCategory)
router.get("/ProductSubcategory/:subcategoryId" , homeClientControll.getProductsBySubcategory)





/// get category and subcategory 
router.get("/CategoryAndSubcategoyOption" , homeClientControll.CategoryAndSubcategoyOption)


// get user info  --------------------------------------------------
router.get("/getUserInfo" , authenticate ,homeUsersControll.getuserInfo)






module.exports = router;
























