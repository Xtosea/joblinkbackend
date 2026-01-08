import Application from "../models/Application.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= CREATE APPLICATION =================
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    // Generate unique access token for this applicant
    const accessToken = crypto.randomBytes(32).toString("hex");

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      accessToken,
    });

    // Link to upload proof or CV
    const accessLink = `${process.env.FRONTEND_URL}/upload/${accessToken}`;

    // Send auto-response email to applicant
    await transporter.sendMail({
      to: email,
      subject: "Application Received",
      html: `
        <h3>Hello ${fullname},</h3>
        <p>Your application was received successfully.</p>
        <p>Please upload your documents (proof of payment / CV) using the link below:</p>
        <a href="${accessLink}">${accessLink}</a>
      `,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      accessToken, // return token so frontend can store / use it
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