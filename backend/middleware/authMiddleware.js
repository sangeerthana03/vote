import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔹 Middleware to protect routes (Check if user is authenticated)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      // ✅ Extract token properly
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }

      // ✅ Check if JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error("🔴 ERROR: JWT_SECRET is not defined in environment variables.");
        return res.status(500).json({ message: "Server error: Missing JWT secret" });
      }

      // ✅ Decode token correctly
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 Decoded Token:", decoded); // 🛠 Debugging

      // ✅ Find user in DB (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // ✅ Allow request to proceed
    } catch (error) {
      console.error("🔴 JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// 🔹 Middleware to check if user is an Admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// 🔹 Middleware to check if user is a Sub-Admin
export const isSubAdmin = (req, res, next) => {
  if (req.user && req.user.role.toLowerCase() === "sub-admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sub-Admins only." });
  }
};

// 🔹 Middleware to check if user has specific roles (Admin, Sub-Admin, Student)
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Convert role to lowercase before checking
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(role => role.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied." });
    }
    
    next();
  };
};

