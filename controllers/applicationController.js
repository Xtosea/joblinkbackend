import Application from "../models/Application.js";
import crypto from "crypto";
import { sendApplicationEmail } from "../utils/mailer.js";

// ================= CREATE APPLICATION =================
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    const emailToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      emailToken,
      tokenExpiresAt,
    });

    const accessLink = `${process.env.FRONTEND_URL}/upload/${emailToken}`;

    try {
  await sendApplicationEmail({
    to: email,
    fullname,
    link: accessLink,
  });
  console.log("✅ Email sent to:", email);
} catch (mailErr) {
  console.error("❌ Email failed:", mailErr);
}

    res.status(201).json({
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET APPLICATION BY TOKEN =================
export const getByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const application = await Application.findOne({
      emailToken: token,
      tokenExpiresAt: { $gt: new Date() },
    });

    if (!application) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    res.json(application);
  } catch (err) {
    console.error("Get by token error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPLOAD FILES =================
export const uploadFiles = async (req, res) => {
  try {
    const { token } = req.params;

    const application = await Application.findOne({
      emailToken: token,
    });

    if (!application) {
      return res.status(404).json({ message: "Invalid token" });
    }

    if (req.files?.proofFile) {
      application.proofFile = `/uploads/${req.files.proofFile[0].filename}`;
    }

    if (req.files?.resumeFile) {
      application.resumeFile = `/uploads/${req.files.resumeFile[0].filename}`;
    }

    await application.save();
    res.json({ message: "Files uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ================= ADMIN: GET ALL APPLICATIONS =================
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};