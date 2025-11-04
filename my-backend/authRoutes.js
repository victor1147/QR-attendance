// authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const router = express.Router();

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  matNo: String,
  password: String,
  role: { type: String, enum: ["student", "lecturer"], default: "student" },
});

const User = mongoose.model("User", userSchema);

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, matNo, password, role } = req.body;

    if (!name || !matNo || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ matNo });
    if (existingUser) {
      return res.status(400).json({ message: "Matric number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, matNo, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { matNo, password } = req.body;
    if (!matNo || !password)
      return res.status(400).json({ message: "Matric number and password required" });

    const user = await User.findOne({ matNo });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: { name: user.name, role: user.role, matNo: user.matNo },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

export default router;