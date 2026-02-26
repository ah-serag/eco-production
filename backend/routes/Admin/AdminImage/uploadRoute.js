const express = require('express');
const router = express.Router();
const {uploadImages , getImages , deleteImage} = require("../../../control/Admin/AdminUplosdImageCon/upload_con");
const {uploadImage} = require("../../../config/multer")
const authenticate = require("../../../middleware/auth/authenticate")
const attachUser = require("../../../middleware/auth/atachUser")
const auhtorize = require("../../../middleware/auth/authorize")

router.post('/Images' ,uploadImage.array("images" ,10),authenticate,attachUser,auhtorize("admin","Super Admin") ,uploadImages);
router.get('/getImages',authenticate,attachUser,auhtorize("admin","Super Admin") , getImages);
router.delete("/del_image/:id", authenticate,attachUser,auhtorize("admin","Super Admin") ,deleteImage )



module.exports = router;
