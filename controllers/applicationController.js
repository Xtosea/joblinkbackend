import Application from "../models/Application.js";
import crypto from "crypto";
import { sendApplicationEmail } from "../utils/mailer.js"; // email only

// ================= CREATE APPLICATION =================
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    // Generate a unique email token and set expiration (24 hours)
    const emailToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create the application document
    const application = await Application.create({
      fullname,
      email,
      mobile,          // keep mobile in the database
      jobType,
      jobPosition,
      emailToken,
      tokenExpiresAt,
    });

    // Create a link for the applicant to upload files
    const accessLink = `${process.env.FRONTEND_URL}/upload/${emailToken}`;

    // ✅ Send email only (no SMS)
    await sendApplicationEmail({ email, fullname, link: accessLink });

    res.status(201).json({
      message: "Application submitted successfully. Check your email for the next steps.",
      emailToken,
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

console.log("Sending email to:", email);