import express from "express";
import { getStudentsByClass, approveStudent, rejectStudent } from "../controllers/subAdminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get students under the sub-admin's class
router.get("/students", protect, authorize(["Sub-Admin"]), getStudentsByClass);

// Approve a student
router.put("/approve/:studentId", protect, authorize(["Sub-Admin"]), approveStudent);

// Reject a student with reason
router.put("/reject/:studentId", protect, authorize(["Sub-Admin"]), rejectStudent);

export default router;
