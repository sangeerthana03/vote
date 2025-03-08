import express from "express";
import { registerUser, loginUser, getUserProfile, getPendingStudents, approveStudent } from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";




const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// User Login Route
router.post("/login", loginUser);

router.get("/pending", protect, isAdmin, getPendingStudents);

// Get User Profile (Protected Route)
router.get("/profile", protect, getUserProfile);


router.put("/approve/:collegeId", protect, isAdmin, approveStudent);
export default router;
