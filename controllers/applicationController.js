import Application from "../models/Application.js";
import crypto from "crypto";
import { sendApplicationEmail } from "../utils/mailer.js";

// ================= CREATE APPLICATION =================
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    const accessToken = crypto.randomBytes(32).toString("hex");

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      accessToken,
    });

    const accessLink = `${process.env.FRONTEND_URL}/upload/${accessToken}`;

    // ✅ Send email safely (won’t crash app)
    try {
      await sendApplicationEmail({
        to: email,
        fullname,
        link: accessLink,
      });
    } catch (mailErr) {
      console.error("❌ Email failed:", mailErr.message);
    }

    res.status(201).json({
      message: "Application submitted successfully",
      accessToken,
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

    const application = await Application.findOne({ accessToken: token });
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

    const application = await Application.findOne({ accessToken: token });
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