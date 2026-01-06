import express from "express";
import Application from "../models/Application.js";
import cloudinary from "../config

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
  
// Inside your POST route
const proofFile = req.files.proofFile;   // from express-fileupload or multer
const resumeFile = req.files.resumeFile;

// Upload proof file
const proofResult = await cloudinary.uploader.upload(proofFile.tempFilePath, {
  folder: "applications/proofs",
});

// Upload resume file
const resumeResult = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
  folder: "applications/resumes",
});

// Save URLs in DB
const application = await Application.create({
  fullname,
  email,
  mobile,
  jobType,
  jobPosition,
  proofFile: proofResult.secure_url,
  resumeFile: resumeResult.secure_url,
});

export default router;
