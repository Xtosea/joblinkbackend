// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";
import { upload } from "../middleware/upload.js";
import { bucket } from "../utils/firebase.js";

const router = express.Router();

router.post(
  "/upload/:id",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const appId = req.params.id;

      if (!appId) return res.status(400).json({ message: "Missing application ID" });

      const application = await Application.findById(appId);
      if (!application) return res.status(404).json({ message: "Application not found" });

      const { proofFile, resumeFile } = req.files;
      if (!proofFile || !resumeFile) return res.status(400).json({ message: "Both files are required" });

      const uploadToFirebase = async (file, folder) => {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
          contentType: file.mimetype,
          resumable: false,
        });

        await fileRef.makePublic(); // public URL

        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      };

      application.proofFile = await uploadToFirebase(proofFile[0], "proofs");
      application.resumeFile = await uploadToFirebase(resumeFile[0], "resumes");

      await application.save();

      res.json({ proofFile: application.proofFile, resumeFile: application.resumeFile });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;