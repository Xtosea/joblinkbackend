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

// ================= MULTER =================
const memoryUpload = multer({ storage: multer.memoryStorage() });

// ================= LOCAL UPLOAD =================
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const localUpload = multer({ dest: uploadDir });

// ================= APPLICANT ROUTES =================
router.post("/", createApplication);
router.get("/access/:token", getByToken);

// ✅ CLOUDINARY UPLOAD
router.post("/upload/cloud/:token", uploadCloudUrls);

// ✅ LOCAL UPLOAD
router.post(
  "/upload/local/:token",
  localUpload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

// ================= ADMIN =================
router.get("/", getAllApplications);

export default router;