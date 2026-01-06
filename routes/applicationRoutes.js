// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";
import { upload } from "../middleware/upload.js";
import { bucket } from "../utils/firebase.js";

const router = express.Router();

// ---------------- CREATE APPLICATION ----------------
// routes/applicationRoutes.js
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

    // Return application ID correctly
    res.status(201).json(application); // or { _id: application._id } 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ---------------- UPLOAD PROOF & RESUME ----------------
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

      const uploadToFirebase = async (file) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileRef = bucket.file(fileName);
        await fileRef.save(file.buffer, { contentType: file.mimetype, public: true });
        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      };

      application.proofFile = await uploadToFirebase(proofFile[0]);
      application.resumeFile = await uploadToFirebase(resumeFile[0]);
      await application.save();

      res.json({ proofFile: application.proofFile, resumeFile: application.resumeFile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// ---------------- GET ALL APPLICATIONS ----------------
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- REPLY TO APPLICATION ----------------
router.post("/reply/:id", async (req, res) => {
  try {
    const { reply, status } = req.body;
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { reply, status: status || "Replied" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;