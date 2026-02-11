import express from "express";

import {
  createApplication,
  getByToken,
  uploadCloudUrls,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

// ================= APPLICANT ROUTES =================
router.post("/", createApplication);
router.get("/access/:token", getByToken);

// ✅ FRONTEND → CLOUDINARY → BACKEND
router.post("/upload/cloud/:token", uploadCloudUrls);

// ================= ADMIN =================
router.get("/", getAllApplications);

export default router;