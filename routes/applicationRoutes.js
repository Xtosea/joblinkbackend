import express from "express";
import multer from "multer";
import {
  createApplication,
  getByToken,
  getAllApplications,
  resendEmail,
  uploadFiles,
  getApplicationById,
} from "../controllers/applicationController.js";
import { verifyAdmin } from "../middleware/auth.js"; // ✅ middleware for admin auth

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ---------------- PUBLIC ROUTES ----------------
router.post("/", createApplication); // submit application
router.get("/access/:token", getByToken); // get application via token link
router.patch(
  "/upload/:token",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

// ---------------- ADMIN ROUTES ----------------
router.get("/", verifyAdmin, getAllApplications); // list all
router.get("/:id", verifyAdmin, getApplicationById); // get by ID
router.patch("/resend/:id", verifyAdmin, resendEmail); // resend email

export default router;