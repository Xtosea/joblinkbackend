import express from "express";
import multer from "multer";
import {
  createApplication,
  getApplications,
  replyToApplication
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------- Multer Setup ----------------

// Memory storage (Firebase uploads)
const storageMemory = multer.memoryStorage();

const uploadMemory = multer({
  storage: storageMemory,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------------- Routes ----------------

// 1️⃣ Create application (no files)
router.post("/", createApplication);

// 2️⃣ One-step submit application with optional files (Firebase)
router.post(
  "/submit",
  uploadMemory.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  createApplication
);

// 3️⃣ Get all applications (admin only)
router.get("/", protect, getApplications);

// 4️⃣ Reply to application (admin only)
router.put("/reply/:id", protect, replyToApplication);

export default router;