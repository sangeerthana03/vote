import express from "express";
import { getPendingUsers, approveUser, rejectUser } from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all pending users
router.get("/pending-users", protect, isAdmin, getPendingUsers);

// Approve a user
router.put("/approve/:id", protect, isAdmin, approveUser);

// Reject a user with reason
router.put("/reject/:id", protect, isAdmin, rejectUser);

export default router;
