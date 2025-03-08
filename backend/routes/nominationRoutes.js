import express from "express";
import { nominationUpload } from "../config/multerConfig.js";
import {
  submitNomination,
  approveNomination,
  rejectNomination,
  getAllNominations,
  getStudentNominations, // ✅ Import this function
} from "../controllers/nominationController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

// ✅ Use `nominationUpload` directly (Remove `.fields([...])`)
router.post("/submit",protect, nominationUpload, submitNomination);

router.put("/approve/:id", protect, isAdmin, approveNomination);
router.put("/reject/:id", protect, isAdmin, rejectNomination);
router.get("/all", protect, isAdmin, getAllNominations);
router.get("/my", protect, getStudentNominations);

export default router;
