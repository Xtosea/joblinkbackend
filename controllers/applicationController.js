import Application from "../models/Application.js";
import crypto from "crypto";
import {
  sendApplicationNotification,
  sendAdminNotification,
} from "../utils/mailer.js";

/* ================= CREATE APPLICATION ================= */
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    const emailToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      emailToken,
      tokenExpiresAt,
    });

    const accessLink = `${process.env.FRONTEND_URL}/upload/${emailToken}`;

    await sendApplicationNotification({ email, fullname, link: accessLink });
    await sendAdminNotification({ fullname, email, jobType, jobPosition });

    res.status(201).json({
      message: "Application submitted. Check your email.",
    });
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET BY EMAIL TOKEN ================= */
export const getByToken = async (req, res) => {
  try {
    const app = await Application.findOne({ emailToken: req.params.token });

    if (!app) return res.status(404).json({ message: "Invalid link" });
    if (app.tokenExpiresAt < new Date())
      return res.status(400).json({ message: "Link expired" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SAVE CLOUDINARY URLS ================= */
export const uploadCloudUrls = async (req, res) => {
  try {
    const { proofUrl, resumeUrl } = req.body;

    if (!proofUrl || !resumeUrl) {
      return res.status(400).json({ message: "Missing file URLs" });
    }

    const app = await Application.findOne({ emailToken: req.params.token });
    if (!app) return res.status(404).json({ message: "Invalid token" });

    app.proofFile = proofUrl;
    app.resumeFile = resumeUrl;
    app.emailToken = null;
    app.tokenExpiresAt = null;

    await app.save();

    res.json({
      message: "Files saved successfully",
      publicToken: app._id,
    });
  } catch (err) {
    console.error("Save URLs error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= ADMIN ================= */
export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};