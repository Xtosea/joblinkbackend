import crypto from "crypto";
import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";
import { sendApplicationEmail } from "../utils/mailer.js";

/* ================= CREATE APPLICATION ================= */
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    if (!fullname || !email || !mobile || !jobType || !jobPosition) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    res.status(201).json({ success: true, message: "Application submitted" });
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET APPLICATION BY TOKEN ================= */
export const getByToken = async (req, res) => {
  try {
    const app = await Application.findOne({
      emailToken: req.params.token,
      tokenExpiresAt: { $gt: new Date() },
    });

    if (!app) {
      return res.status(404).json({ message: "Link expired or invalid" });
    }

    res.json(app);
  } catch (err) {
    console.error("Get by token error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESEND EMAIL ================= */
export const resendEmail = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // Refresh expiry
    app.tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await app.save();

    const link = `${process.env.FRONTEND_URL}/applicant/${app.emailToken}`;

    await sendApplicationEmail({
      to: app.email,
      fullname: app.fullname,
      link,
    });

    res.json({ message: "Email resent successfully" });
  } catch (err) {
    console.error("Resend email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPLOAD FILES ================= */
export const uploadFiles = async (req, res) => {
  try {
    const app = await Application.findOne({
      emailToken: req.params.token,
      tokenExpiresAt: { $gt: new Date() },
    });

    if (!app) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    if (req.files?.proofFile) {
      const proof = await cloudinary.uploader.upload(
        req.files.proofFile[0].path,
        {
          folder: "joblink/proofs",
          resource_type: "auto",
        }
      );
      app.proofFile = proof.secure_url;
    }

    if (req.files?.resumeFile) {
      const resume = await cloudinary.uploader.upload(
        req.files.resumeFile[0].path,
        {
          folder: "joblink/resumes",
          resource_type: "auto",
        }
      );
      app.resumeFile = resume.secure_url;
    }

    await app.save();
    res.json({ success: true, message: "Files uploaded successfully" });
  } catch (err) {
    console.error("Upload files error:", err);
    res.status(500).json({ message: "Server error" });
  }
};