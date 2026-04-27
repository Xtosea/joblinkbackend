import express from "express";
const router = express.Router();

import JobApplication from "../models/JobApplication.js";

import {
  getJobs,
  getJobById,
  applyToJob,
  createJob,
  getAllJobApplicants,
  getJobTypes,
  getJobApplicants,
  getEmployerJobs,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";


// ================= ADMIN =================
router.get("/admin/applicants", getAllJobApplicants);

// ================= JOB TYPES =================
router.get("/types", getJobTypes);

// ================= JOB CRUD =================
router.get("/", getJobs);

// Employer creates job
router.post("/", protect, checkRole("employer"), createJob);

// ================= APPLY =================
router.post("/:id/apply", protect, checkRole("applicant"), applyToJob);

// ================= JOB DETAILS =================
router.get("/:id/applicants", protect, checkRole("employer"), getJobApplicants);

router.get("/:id", getJobById);

// ================= EMPLOYER JOBS =================
router.get("/employer/jobs", protect, checkRole("employer"), getEmployerJobs);

// ================= BOOST JOB =================
router.patch(
  "/jobs/:id/boost",
  protect,
  checkRole("employer"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      job.isFeatured = true;
      job.planType = "premium";
      job.featuredUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await job.save();

      res.json({
        message: "Job boosted successfully 🔥",
        job,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;