import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

// **REGISTER USER**
// **REGISTER USER**
export const register = async (req, res) => {
  const { collegeId, email, password, role, className } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // ✅ Remove manual hashing (it will be handled in `User.js`)
    const user = new User({ collegeId, email, password, role, className });
    await user.save();

    res.status(201).json({ success: true, message: "Registration Successful! Waiting for Approval." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// **LOGIN USER**
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login Attempt:", email, password); // 🛠 Debugging

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user); // 🛠 Debugging

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Compare hashed password with entered password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // 🛠 Debugging

    if (!isMatch) {
      console.log("Password incorrect");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isApproved) {
      console.log("User approval pending");
      return res.status(403).json({ success: false, message: "Approval Pending" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token Generated:", token); // 🛠 Debugging

    res.json({ success: true, token, user });
  } catch (error) {
    console.log("Login Error:", error.message); // 🛠 Debugging
    res.status(500).json({ success: false, error: error.message });
  }
};
