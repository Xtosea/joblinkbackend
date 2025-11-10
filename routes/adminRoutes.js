import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  adminLogin,
  getAllApplications,
  updateApplication,
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import Admin from "../models/adminModel.js";

dotenv.config();

const router = express.Router();

// ======================
// 🔐 ADMIN LOGIN
// ======================
router.post("/login", adminLogin);

// (Optional) — Route to register a new admin (only for initial setup)
// You can remove this after creating your first admin manually in MongoDB.
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, name });
    await admin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// 📋 APPLICATION MANAGEMENT
// ======================

// ✅ Fetch all job applications
router.get("/applications", verifyToken, verifyAdmin, getAllApplications);

// ✅ Update an application's reply or status
router.put("/applications/:id", verifyToken, verifyAdmin, updateApplication);

export default router;