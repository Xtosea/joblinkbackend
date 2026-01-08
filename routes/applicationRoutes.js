import express from "express";
import multer from "multer";
import {
  createApplication,
  getByToken,
  getAllApplications,
  getApplicationById,
  resendEmail,
  uploadFiles,
} from "../controllers/applicationController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.post("/", createApplication);
router.get("/access/:token", getByToken);
router.patch(
  "/upload/:token",
  upload.fields([{ name: "proofFile" }, { name: "resumeFile" }]),
  uploadFiles
);

// Admin routes
router.get("/", verifyToken, verifyAdmin, getAllApplications);
router.get("/:id", verifyToken, verifyAdmin, getApplicationById);
router.patch("/resend/:id", verifyToken, verifyAdmin, resendEmail);

export default router;