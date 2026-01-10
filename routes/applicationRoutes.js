import express from "express";
import multer from "multer";
import {
  createApplication,
  getByToken,
  uploadFiles,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ================= APPLICANT ROUTES =================
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

// ================= ADMIN ROUTE =================
router.get("/", getAllApplications);

export default router;