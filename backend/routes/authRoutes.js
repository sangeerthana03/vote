import express from "express";
import { register, login } from "../controllers/authController.js";
import User from "../models/User.js"; // ✅ Import User model
import { protect, isAdmin, isSubAdmin, authorize } from "../middleware/authMiddleware.js";


const router = express.Router();

// 🔹 User Registration
router.post("/register", register);

// 🔹 User Login
router.post("/login", login);

// ✅ New Route: Get Logged-in User Details (Fixes 404 Error)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
