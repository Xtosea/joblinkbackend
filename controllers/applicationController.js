// controllers/applicationController.js
import Application from '../models/Application.js';

// Step 1: Create application (without files)
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
    res.status(500).json({ message: error.message });
  }
};

// Step 2: Upload files
export const uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const proofFile = req.files?.proofFile?.[0]?.filename;
    const resumeFile = req.files?.resumeFile?.[0]?.filename;

    if (!proofFile && !resumeFile) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { proofFile, resumeFile },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications (protected)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to application (protected)
export const replyToApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      id,
      { reply, status: status || 'Replied' },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};