const multer = require("multer");

const storage = multer.memoryStorage();


const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only type : JPG, PNG, WEBP and SVG are allowed."), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/mpeg", "video/quicktime", "video/webm"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid video type. Only MP4, MPEG and WEBM are allowed."), false);
  }
};

const excelFilter = (req, file, cb) => {
  const allowed = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid Excel file type. Only .xlsx and .xls are allowed."), false);
  }
};


 // function bublic
const handleMulterError = (err, res, next, maxCount, type = "IMAGES") => {
  if (err) {
    let errorMessage = "An error occurred while uploading.";

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        errorMessage = `allowed limit : ${maxCount} ${type}`;
      } else if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = type === "VIDEOS" ? "Max Size : 50MB" : "Max Size : 5MB";
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return res.status(400).json({
      success: false,
      message: errorMessage
    });
  }
  next();
};

// images //
const handleImageUpload = (name, maxCount) => {
  const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).array(name, maxCount);

  return (req, res, next) => {
    upload(req, res, (err) => handleMulterError(err, res, next, maxCount));
  };
};

const handleFieldsUpload = (fieldsConfig) => {
  const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).fields(fieldsConfig);

  return (req, res, next) => {
    upload(req, res, (err) => handleMulterError(err, res, next, "specified", "IMAGES"));
  };
};

// videos //
const handleVideoUpload = (name, maxCount) => {
  const upload = multer({
    storage,
    fileFilter: videoFilter,
    limits: { fileSize: 50 * 1024 * 1024 } 
  }).array(name, maxCount);

  return (req, res, next) => {
    upload(req, res, (err) => handleMulterError(err, res, next, maxCount, "VIDEOS"));
  };
};

// images and vidos
const handleProductMediaUpload = (fieldsConfig) => {
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        imageFilter(req, file, cb);
      } else if (file.mimetype.startsWith("video/")) {
        videoFilter(req, file, cb);
      } else {
        cb(new Error("Invalid file type. Only images and videos are allowed!"), false);
      }
    },
    limits: { fileSize: 50 * 1024 * 1024 } 
  }).fields(fieldsConfig);

  return (req, res, next) => {
    upload(req, res, (err) => handleMulterError(err, res, next, "the allowed", "FILES"));
  };
};

// excel // 
const handleExcelUpload = (name) => {
  const upload = multer({ storage, fileFilter: excelFilter }).single(name);
  return (req, res, next) => {
    upload(req, res, (err) => handleMulterError(err, res, next, 1, "EXCEL"));
  };
};

module.exports = {
  handleImageUpload,
  handleFieldsUpload,
  handleVideoUpload,
  handleProductMediaUpload,
  handleExcelUpload
};