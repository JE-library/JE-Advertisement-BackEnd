const multer = require("multer");

//configuring Storage
const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newName = Date.now();
    cb(null, newName + "==" + file.originalname);
  },
});

const myFileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only .jpeg, .jpg and .png files are allowed!"), false); // Reject file
  }
  cb(null, true); // Accept file
};

const upload = multer({
  storage: myStorage,
  fileFilter: myFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = upload;
