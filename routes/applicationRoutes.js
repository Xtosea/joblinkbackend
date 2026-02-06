import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Application from "../models/Application.js";
import {
  createApplication,
  getByToken,
  uploadFiles,
  uploadFilesToCloud,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

// ================= CLOUDINARY SETUP =================
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "joblink_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  },
});

const cloudUpload = multer({ storage: cloudStorage });

// ================= LOCAL MULTER SETUP =================
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const localUpload = multer({ dest: uploadDir });

// ================= APPLICANT ROUTES =================

// Create application
router.post("/", createApplication);

// Access upload page via email token
router.get("/access/:token", getByToken);

// Upload proof + CV (one-time email token) → Cloudinary
router.patch(
  "/upload/cloud/:token",
  cloudUpload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFilesToCloud
);

// Upload proof + CV (one-time email token) → Local folder
router.patch(
  "/upload/local/:token",
  localUpload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

// ================= HISTORY ROUTE (PUBLIC TOKEN) =================
router.get("/history/:publicToken", async (req, res) => {
  try {
    const app = await Application.findOne({
      publicToken: req.params.publicToken,
    });

    if (!app) return res.status(404).json({ message: "Not found" });

    res.json(app);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN ROUTE =================
router.get("/", getAllApplications);

export default router;