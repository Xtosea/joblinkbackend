import express from "express";
import multer from "multer";
import {
  createApplication,
  getByToken,
  uploadFiles,
  getAllApplications,
  resendEmail,
  getApplicationById,
} from "../controllers/applicationController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", createApplication);
router.get("/access/:token", getByToken);

router.patch(
  "/upload/:token",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

// Admin
router.get("/", verifyToken, verifyAdmin, getAllApplications);
router.get("/:id", verifyToken, verifyAdmin, getApplicationById);
router.patch("/resend/:id", verifyToken, verifyAdmin, resendEmail);

export default router;