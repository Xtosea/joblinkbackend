import express from "express";
import multer from "multer";
import {
  createApplication,
  uploadFiles,
  getApplications,
  replyToApplication
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../utils/firebaseUpload.js";

const router = express.Router();

// ---------------- Multer Setup ----------------

// Disk storage (for local uploads)
const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// Memory storage (for Firebase uploads)
const storageMemory = multer.memoryStorage();

const uploadDisk = multer({ storage: storageDisk, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadMemory = multer({ storage: storageMemory });

// ---------------- Routes ----------------

// 1️⃣ Create application (without files)
router.post("/", createApplication);

// 2️⃣ Upload files for existing application (local disk)
router.post(
  "/upload/:id",
  uploadDisk.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  uploadFiles
);

// 3️⃣ One-step submit application with optional files (Firebase)
router.post(
  "/submit",
  uploadMemory.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Upload files to Firebase if present
      const uploadedFiles = {};
      if (req.files?.proofFile?.[0]) {
        uploadedFiles.proofFile = await uploadFileToFirebase(req.files.proofFile[0], "proofs");
      }
      if (req.files?.resumeFile?.[0]) {
        uploadedFiles.resumeFile = await uploadFileToFirebase(req.files.resumeFile[0], "resumes");
      }

      // Call your createApplication controller with uploaded file URLs
      const application = await createApplication({ ...req.body, files: uploadedFiles });
      res.status(201).json({ success: true, application });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Application submission failed" });
    }
  }
);

// 4️⃣ Get all applications (admin only)
router.get("/", protect, getApplications);

// 5️⃣ Reply to application (admin only)
router.put("/reply/:id", protect, replyToApplication);

export default router;