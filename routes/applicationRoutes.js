// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";
import { upload } from "../middleware/upload.js";
import { bucket } from "../utils/firebase.js";

const router = express.Router();

// ---------------- CREATE APPLICATION ----------------
router.post("/", async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;
    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      status: "Pending",
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error(err);
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
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Missing application ID" });

      const application = await Application.findById(id);
      if (!application) return res.status(404).json({ message: "Application not found" });

      const { proofFile, resumeFile } = req.files;
      if (!proofFile || !resumeFile) return res.status(400).json({ message: "Both files are required" });

      const uploadToFirebase = async (file, folder) => {
        const filename = `${folder}/${Date.now()}-${file.originalname}`;
        const fileRef = bucket.file(filename);

        await fileRef.save(file.buffer, { contentType: file.mimetype, resumable: false });
        await fileRef.makePublic();

        return `https://storage.googleapis.com/${bucket.name}/${filename}`;
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