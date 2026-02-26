const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg" ,"image/svg" ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid image type"));
};

const excelFilter = (req, file, cb) => {
  const allowed = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid Excel file type"));
};

module.exports = {
  uploadImage: multer({ storage, fileFilter: imageFilter }),
  uploadExcel: multer({ storage, fileFilter: excelFilter }),
};
