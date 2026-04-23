import express from "express";
import bcrypt from "bcryptjs";

import {
  adminLogin,
  getAllApplications,
  getApplicationById,
  updateApplication,
  resendEmail,
} from "../controllers/adminController.js";

import { verifyAdmin } from "../middleware/auth.js";
import Admin from "../models/adminModel.js";

const router = express.Router();

/* ======================
   🔐 ADMIN AUTH
====================== */

// ✅ ADMIN LOGIN
router.post("/login", adminLogin);

// ⚠️ OPTIONAL: ADMIN REGISTER (use once, then remove)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   📋 APPLICATION MANAGEMENT
====================== */

// ✅ GET all applications
router.get("/applications", verifyAdmin, getAllApplications);

// ✅ GET single application
router.get("/applications/:id", verifyAdmin, getApplicationById);

// ✅ UPDATE application (reply / status)
router.put("/applications/:id", verifyAdmin, updateApplication);

// ✅ RESEND application email
router.post("/applications/resend/:id", verifyAdmin, resendEmail);

export default router;


router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ notifications });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});


router.patch("/notifications/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});