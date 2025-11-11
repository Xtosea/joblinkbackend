import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Application from "../models/Application.js";

// ======================
// 🧩 ADMIN LOGIN
// ======================
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name || "Admin",
      },
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// ======================
// 📋 GET ALL APPLICATIONS
// ======================
export const getAllApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find().sort({ createdAt: -1 });
  res.json(apps);
});

// ======================
// ✏️ UPDATE APPLICATION (reply/status)
// ======================
export const updateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reply, status } = req.body;

  const updated = await Application.findByIdAndUpdate(
    id,
    { reply, status },
    { new: true }
  );

  if (!updated) {
    res.status(404);
    throw new Error("Application not found");
  }

  res.json({
    message: "Application updated successfully",
    application: updated,
  });
});