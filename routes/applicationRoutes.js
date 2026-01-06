import express from "express";
import Application from "../models/Application.js";
import { upload } from "../middleware/upload.js";
import { uploadFileToFirebase } from "../utils/firebaseUpload.js";

const router = express.Router();

// ---------------- CREATE APPLICATION ----------------
router.post("/", async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      status: "Pending",
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- UPLOAD FILES ----------------
router.post(
  "/upload/:id",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      if (!application)
        return res.status(404).json({ message: "Application not found" });

      if (!req.files?.proofFile || !req.files?.resumeFile)
        return res.status(400).json({ message: "Both files required" });

      application.proofFile = await uploadFileToFirebase(
        req.files.proofFile[0],
        "proofs"
      );

      application.resumeFile = await uploadFileToFirebase(
        req.files.resumeFile[0],
        "resumes"
      );

      await application.save();

      res.json({
        proofFile: application.proofFile,
        resumeFile: application.resumeFile,
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ---------------- GET ALL APPLICATIONS ----------------
router.get("/", async (req, res) => {
  const apps = await Application.find().sort({ createdAt: -1 });
  res.json(apps);
});

// ---------------- REPLY ----------------
router.post("/reply/:id", async (req, res) => {
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

export default router;