import express from "express";
import {
  createApplication,
  getByToken,
  uploadCloudUrls,
  getAllApplications,
  getHistoryByPublicToken, // 👈 ADD THIS
} from "../controllers/applicationController.js";

const router = express.Router();

// ================= APPLICANT ROUTES =================
router.post("/", createApplication);
router.get("/access/:token", getByToken);

// FRONTEND → CLOUDINARY → BACKEND
router.post("/upload/cloud/:token", uploadCloudUrls);

// ✅ HISTORY (PUBLIC)
router.get("/history/:token", getHistoryByPublicToken);

// ================= ADMIN =================
router.get("/", getAllApplications);

export default router;