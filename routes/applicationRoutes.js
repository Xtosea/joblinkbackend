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

// ---------------- CREATE APPLICATION (PUBLIC) ----------------
router.post("/", createApplication);

// ---------------- GET ALL APPLICATIONS (ADMIN) ----------------
router.get("/", verifyAdmin, getAllApplications);

// ---------------- GET SINGLE APPLICATION BY ID (ADMIN) ----------------
router.get("/:id", verifyAdmin, getApplicationById);

// ---------------- GET APPLICATION BY TOKEN (PUBLIC, VIA EMAIL LINK) ----------------
router.get("/access/:token", getByToken);

// ---------------- RESEND EMAIL (ADMIN) ----------------
router.patch("/resend/:id", verifyAdmin, resendEmail);

// ---------------- UPLOAD FILES (PUBLIC VIA EMAIL LINK) ----------------
router.patch(
  "/upload/:token",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

export default router;