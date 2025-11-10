// controllers/applicationController.js
import Application from "../models/Application.js";

// ✅ Step 1: Create new application (without files)
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Step 2: Upload files (proof + resume)
export const uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const proofFile = req.files?.proofFile?.[0]?.filename;
    const resumeFile = req.files?.resumeFile?.[0]?.filename;

    if (!proofFile && !resumeFile) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // ✅ Detect backend base URL dynamically
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://joblinknigeria.onrender.com" // Render live URL
        : "http://localhost:5000"; // Local dev URL

    // ✅ Construct full URLs for uploaded files
    const proofFileUrl = proofFile ? `${baseUrl}/uploads/${proofFile}` : null;
    const resumeFileUrl = resumeFile ? `${baseUrl}/uploads/${resumeFile}` : null;

    // ✅ Update MongoDB record with uploaded file URLs
    const updated = await Application.findByIdAndUpdate(
      id,
      { proofFile: proofFileUrl, resumeFile: resumeFileUrl },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Step 3: Get all applications (Admin protected)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Step 4: Reply to application (Admin protected)
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