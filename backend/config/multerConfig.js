import multer from "multer";
import path from "path";
import fs from "fs";

// Create the uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// File Type Validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".docx", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, JPG, and PNG files are allowed."), false);
  }
};

// Multer Upload Configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Export Upload Middleware (Multiple Files)
export const nominationUpload = upload.fields([
  { name: "idProof", maxCount: 1 },
  { name: "academicReport", maxCount: 1 },
  { name: "attendanceProof", maxCount: 1 },
  { name: "disciplinaryClearance", maxCount: 1 },
  { name: "manifesto", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 }
]);
