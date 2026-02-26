const express = require('express');
const router = express.Router();
const productsControll = require("../../../control/Admin/AdminProductsCon/products_con");
const {uploadExcel , uploadImage} = require("../../../config/multer")
const authenticate = require("../../../middleware/auth/authenticate")
const attachUser = require("../../../middleware/auth/atachUser")
const auhtorize = require("../../../middleware/auth/authorize")



/// 
router.get('/getProductsAdmin',authenticate,attachUser,auhtorize("admin", "Super Admin") ,productsControll.getProductsAdmin);


router.patch('/toggleActive/:id',authenticate,attachUser,auhtorize("admin" ,"Super Admin","vendor"), productsControll.toggleActive);
router.put("/EditProducts/:id",authenticate,attachUser,auhtorize("admin" ,"Super Admin","vendor"), productsControll.editProduct);
router.delete("/deleteProduct/:id",authenticate,attachUser,auhtorize("admin" ,"Super Admin","vendor"), productsControll.deleteProduct);



/// add product 
router.post('/addProductWithImages', uploadImage.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ])  ,authenticate,attachUser,auhtorize("admin" ,"Super Admin","vendor") , productsControll.addProductWithImages);


// ai product 
router.post('/addProductFromAI' ,authenticate,attachUser,auhtorize("admin" ,"Super Admin","vendor") , productsControll.addProductFromAI);
router.post('/addProductsFromExcel', uploadExcel.single("excelFile") ,authenticate,attachUser,auhtorize("admin" ,"Super Admin")  , productsControll.addProductsFromExcel);











module.exports = router;






