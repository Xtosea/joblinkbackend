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

    await transporter.sendMail({
      to: email,
      subject: "Application Received",
      html: `
        <h3>Hello ${fullname}</h3>
        <p>Your application was received successfully.</p>
        <p>Upload your documents using the link below:</p>
        <a href="${accessLink}">${accessLink}</a>
      `,
    });

    res.status(201).json(application);
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET BY TOKEN =================
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

// ================= ADMIN =================
export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplicationById = async (req, res) => {
  const app = await Application.findById(req.params.id);
  res.json(app);
};

export const resendEmail = async (req, res) => {
  const app = await Application.findById(req.params.id);

  const link = `${process.env.FRONTEND_URL}/upload/${app.accessToken}`;

  await transporter.sendMail({
    to: app.email,
    subject: "Application Upload Link",
    html: `<a href="${link}">${link}</a>`,
  });

  res.json({ message: "Email resent" });
};