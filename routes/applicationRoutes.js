// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js"; // your Mongoose model
import { upload } from "../middleware/upload.js";
import { bucket } from "../utils/firebase.js";

const router = express.Router();

// Upload Proof & Resume
router.post(
  "/upload/:id",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const appId = req.params.id;
      const application = await Application.findById(appId);
      if (!application) return res.status(404).json({ message: "Application not found" });

      const { proofFile, resumeFile } = req.files;

      if (!proofFile || !resumeFile) return res.status(400).json({ message: "Both files are required" });

      // Helper to upload file to Firebase
      const uploadToFirebase = async (file) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
          contentType: file.mimetype,
          public: true, // make it publicly accessible
        });

        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      };

      const proofUrl = await uploadToFirebase(proofFile[0]);
      const resumeUrl = await uploadToFirebase(resumeFile[0]);

      // Save URLs in MongoDB
      application.proofUrl = proofUrl;
      application.resumeUrl = resumeUrl;
      await application.save();

      res.json({ proofUrl, resumeUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;