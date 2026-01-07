import express from "express";
import multer from "multer";
import {
  createApplication,
  getByToken,
  uploadFiles,
} from "../controllers/applicationController.js";

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

export default router;