const express = require('express');
const router = express.Router();

const authenticate = require("../../../middleware/auth/authenticate");
const attachUser = require("../../../middleware/auth/atachUser");
const auhtorize = require("../../../middleware/auth/authorize");

const {handleVideoUpload} = require("../../../config/multer")

const videoController = require("../../../control/Admin/AdminVideosCon/AdminVideosCon");


router.post(
  '/upload', 
  authenticate, 
  attachUser, 
  auhtorize("admin","Super Admin"),
  handleVideoUpload('videos', 3),
  videoController.uploadVideos
);




module.exports = router;