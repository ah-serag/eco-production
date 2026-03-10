const express = require('express');
const router = express.Router();
const catagoryControll = require("../../../control/Admin/AdminCategoryCon/category_con")
const authenticate = require("../../../middleware/auth/authenticate")
const attachUser = require("../../../middleware/auth/atachUser")
const auhtorize = require("../../../middleware/auth/authorize")



router.get('/getCategoryAndSubAdmin',authenticate,attachUser,auhtorize("admin" ,"Super Admin" ,"vendor") ,  catagoryControll.getCategoryAndSubAdmin);
router.get('/getCategory',authenticate,attachUser,auhtorize("admin" ,"Super Admin" ,"vendor") ,  catagoryControll.getCategory);
router.get('/getCategoryOptions',authenticate,attachUser,auhtorize("admin" ,"Super Admin" ,"vendor") ,  catagoryControll.getCategoryOptions);
router.get('/getSubcategoryOptions',authenticate,attachUser,auhtorize("admin" ,"Super Admin" ,"vendor") ,  catagoryControll.getSubcategoryOptions);

router.post('/addsubcategories',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.addSubcategories);
router.post('/addcategories',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.addCategories);

router.delete('/deleteCategory/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.deleteCategory);
router.delete('/deleteSubcategory/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.deleteSubcategory);

router.patch('/editCategoryName/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.editCategoryName);
router.patch('/editSubcategoryName/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.editSubcategoryName);


router.patch('/toggleCategoryStatus/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.toggleCategoryStatus);
router.patch('/toggleSubcategoryStatus/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin"), catagoryControll.toggleSubcategoryStatus);


module.exports = router;