import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createApplication,
  getByToken,
  uploadFiles,
  uploadFilesToCloud,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

// ================= MULTER SETUP =================
const upload = multer({ storage: multer.memoryStorage() });

// ================= LOCAL MULTER =================
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const localUpload = multer({ dest: uploadDir });

// ================= APPLICANT ROUTES =================
router.post("/", createApplication);
router.get("/access/:token", getByToken);

// Cloud upload
router.patch(
  "/upload/cloud/:token",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFilesToCloud
);

// Local upload
router.patch(
  "/upload/local/:token",
  localUpload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

// History (public)
router.get("/history/:publicToken", async (req, res) => {
  try {
    const app = await Application.findOne({
      publicToken: req.params.publicToken,
    });

    if (!app) return res.status(404).json({ message: "Not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin
router.get("/", getAllApplications);

export default router;