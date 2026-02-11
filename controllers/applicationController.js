import Application from "../models/Application.js";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
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

/* ================= LOCAL UPLOAD ================= */
export const uploadFiles = async (req, res) => {
  try {
    const app = await Application.findOne({ emailToken: req.params.token });
    if (!app) return res.status(404).json({ message: "Invalid token" });

    if (req.files?.proofFile)
      app.proofFile = `/uploads/${req.files.proofFile[0].filename}`;

    if (req.files?.resumeFile)
      app.resumeFile = `/uploads/${req.files.resumeFile[0].filename}`;

    app.emailToken = null;
    app.tokenExpiresAt = null;

    await app.save();

    res.json({
      message: "Uploaded",
      publicToken: app._id,
    });
  } catch (err) {
    console.error("Local upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= CLOUDINARY UPLOAD ================= */
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "raw", // ✅ IMPORTANT
        },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });

export const uploadFilesToCloud = async (req, res) => {
  try {
    const app = await Application.findOne({ emailToken: req.params.token });
    if (!app) return res.status(404).json({ message: "Invalid token" });

    if (!req.files?.proofFile || !req.files?.resumeFile) {
      return res.status(400).json({ message: "Both files are required" });
    }

    const proof = await uploadToCloudinary(
      req.files.proofFile[0].buffer,
      "joblink_uploads"
    );

    const resume = await uploadToCloudinary(
      req.files.resumeFile[0].buffer,
      "joblink_uploads"
    );

    app.proofFile = proof.secure_url;
    app.resumeFile = resume.secure_url;
    app.emailToken = null;
    app.tokenExpiresAt = null;

    await app.save();

    res.json({
      message: "Uploaded successfully",
      publicToken: app._id,
    });
  } catch (err) {
    console.error("Cloud upload error:", err);
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