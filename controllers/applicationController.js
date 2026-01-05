import Application from "../models/Application.js";
import { uploadFileToFirebase } from "../utils/firebaseUpload.js";

// ---------------- CREATE APPLICATION ----------------
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    let proofFile = null;
    let resumeFile = null;

    if (req.files?.proofFile?.[0]) {
      proofFile = await uploadFileToFirebase(req.files.proofFile[0], "proofs");
    }

    if (req.files?.resumeFile?.[0]) {
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

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET ALL APPLICATIONS (ADMIN) ----------------
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- REPLY TO APPLICATION ----------------
export const replyToApplication = async (req, res) => {
  try {
    const { reply, status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { reply, status: status || "Replied" },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};