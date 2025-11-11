import Application from "../models/Application.js";
import { uploadFileToFirebase } from "../utils/firebaseUpload.js";

// Create new application (with optional files)
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;
    let proofFile = null;
    let resumeFile = null;

    // Upload files if present
    if (req.files?.proofFile) {
      proofFile = await uploadFileToFirebase(req.files.proofFile[0], "proofs");
    }
    if (req.files?.resumeFile) {
      resumeFile = await uploadFileToFirebase(req.files.resumeFile[0], "resumes");
    }

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      proofFile,
      resumeFile,
      status: "Pending",
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Upload files (proof + resume)
export const uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.files?.proofFile?.[0]) {
      updates.proofFile = await uploadFileToFirebase(req.files.proofFile[0], "proofs");
    }
    if (req.files?.resumeFile?.[0]) {
      updates.resumeFile = await uploadFileToFirebase(req.files.resumeFile[0], "resumes");
    }

    const updated = await Application.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
};

// Get all applications
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reply to application
export const replyToApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      id,
      { reply, status: status || "Replied" },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ message: error.message });
  }
};