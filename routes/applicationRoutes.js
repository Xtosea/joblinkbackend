import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Application from "../models/Application.js";
import {
  createApplication,
  getByToken,
  uploadFiles,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

// ================= MULTER SETUP =================
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  dest: uploadDir,
});

// ================= APPLICANT ROUTES =================

// Create application
router.post("/", createApplication);

// Access upload page via email token
router.get("/access/:token", getByToken);

// Upload proof + CV (one-time email token)
router.patch(
  "/upload/:token",
  upload.fields([
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

    if (!app) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(app);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN ROUTE =================
router.get("/", getAllApplications);

export default router;