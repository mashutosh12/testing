import multer from "multer";
import path from "path";

// File Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");  //  Jo Folder Me Save Karna Hai (Root Me "uploads/" Folder Create Karo)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));  
  }
});

//  File Type Filter (Sirf Images Allow Karo)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error("Only JPEG, JPG, and PNG files are allowed!"));
  }
};

//  Multer Upload Middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50* 1024 * 1024 }, // Max 5MB File Allowed
  fileFilter: fileFilter,
});

export default upload;
