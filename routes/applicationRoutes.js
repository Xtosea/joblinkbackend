import express from "express";
import multer from "multer";
import {
  createApplication,
  getByToken,
  uploadFiles,
} from "../controllers/applicationController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ================== APPLICANT ROUTES ==================
// Submit application
router.post("/", createApplication);

// Get application info by token (for upload page / history)
router.get("/access/:token", getByToken);

// Upload proof / resume files
router.patch(
  "/upload/:token",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

export default router;