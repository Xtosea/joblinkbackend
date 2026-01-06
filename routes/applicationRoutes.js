import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// CREATE APPLICATION
router.post("/", async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      status: "Pending",
    });

    res.status(201).json({ _id: application._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// UPLOAD FILES
router.patch("/upload/:id", async (req, res) => {
  try {
    const { proofFile, resumeFile } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.proofFile = proofFile;
    application.resumeFile = resumeFile;
    await application.save();

    res.json({ success: true, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;