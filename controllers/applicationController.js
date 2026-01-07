import crypto from "crypto";
import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";
import { sendApplicationEmail } from "../utils/mailer.js";

// ================= CREATE APPLICATION =================
export const createApplication = async (req, res) => {
  const { fullname, email, mobile, jobType, jobPosition } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  const app = await Application.create({
    fullname,
    email,
    mobile,
    jobType,
    jobPosition,
    emailToken: token,
    tokenExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  const dashboardLink = `${process.env.FRONTEND_URL}/applicant/${token}`;

  await sendApplicationEmail({
    to: email,
    fullname,
    link: dashboardLink,
  });

  res.status(201).json({ success: true });
};

// ================= GET APPLICATION BY TOKEN =================
export const getByToken = async (req, res) => {
  const app = await Application.findOne({
    emailToken: req.params.token,
    tokenExpiresAt: { $gt: new Date() },
  });

  if (!app) {
    return res.status(404).json({ message: "Link expired or invalid" });
  }

  res.json(app);
};


export const resendEmail = async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });

  const link = `${process.env.FRONTEND_URL}/applicant/${app.emailToken}`;
  await sendApplicationEmail({
    to: app.email,
    fullname: app.fullname,
    link,
  });

  res.json({ message: "Email resent successfully" });
};

// ================= UPLOAD FILES =================
export const uploadFiles = async (req, res) => {
  const app = await Application.findOne({
    emailToken: req.params.token,
    tokenExpiresAt: { $gt: new Date() },
  });

  if (!app) return res.status(404).json({ message: "Invalid or expired link" });

  if (req.files?.proofFile) {
    const proof = await cloudinary.uploader.upload(req.files.proofFile[0].path);
    app.proofFile = proof.secure_url;
  }

  if (req.files?.resumeFile) {
    const resume = await cloudinary.uploader.upload(req.files.resumeFile[0].path);
    app.resumeFile = resume.secure_url;
  }

  await app.save();
  res.json({ success: true });
};