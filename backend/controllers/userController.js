import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // Debugging ✅

    const { collegeId, email, password, role, className } = req.body;

    // Ensure all required fields are present
    if (!collegeId || !email || !password || !role) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    // Hash Password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ collegeId, email, password: hashedPassword, role, className });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error Saving User:", error); // Debugging ✅
    res.status(400).json({ error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    bcrypt.compare(password, user.password).then(match => {
      console.log(match ? "✅ Password Match!" : "❌ Password Incorrect!");
    });
    const hashPass="$2a$12$/HktKZ3Tk/YZA1rA4laspe1ItweGGh02BokmDUyO6k0L/fiFR9CYm";
    if(hashPass.localeCompare(user.password)){
      console.log("from input: ",user.password);
      console.log("hashed: ",hashPass);
      console.log("same");
    }
    
    
     if (!isMatch) {
       return res.status(400).json({ error: "Invalid credentials" });
     }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret Key
      { expiresIn: "1h" } // Token Expiration (1 hour)
    );

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        className: user.className,
        isApproved: user.isApproved,
      },
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile (Protected)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await User.find({ isApproved: false });
    res.json(pendingStudents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const approveStudent = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const user = await User.findOne({ collegeId });
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "Student approved successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};