import express from "express";
import {
  createApplication,
  getByToken,
  uploadCloudUrls,
  getAllApplications,
  getHistoryByPublicToken,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// PUBLIC
router.post("/", createApplication);
router.get("/access/:token", getByToken);
router.post("/upload/cloud/:token", uploadCloudUrls);
router.get("/history/:token", getHistoryByPublicToken);

// ADMIN (PROTECTED)
router.get("/applications", getAllApplications);
router.patch("/applications/:id/status", updateApplicationStatus);

export default router;