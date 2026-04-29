import express from "express";
import Job from "../models/Job.js";

import {
  getJobs,
  getJobById,
  applyToJob,
  createJob,
  getAllJobApplicants,
  getJobApplicants,
  getEmployerJobs,
  getJobTypes,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();


// ================= ADMIN ROUTES =================
router.get("/admin/applicants", protect, checkRole("admin"), getAllJobApplicants);


// ================= PUBLIC ROUTES =================

// Get all jobs
router.get("/", getJobs);

// Get job types
router.get("/types", getJobTypes);

// Get single job
router.get("/:id", getJobById);


// ================= APPLICANT ROUTES =================

// Apply to job (ONLY applicants)
router.post("/:id/apply", protect, checkRole("applicant"), applyToJob);


// ================= EMPLOYER ROUTES =================

// Create job (ONLY employers)
router.post("/", protect, checkRole("employer"), createJob);

// Get employer jobs
router.get("/employer/jobs", protect, checkRole("employer"), getEmployerJobs);

// Get applicants for a specific job
router.get(
  "/:id/applicants",
  protect,
  checkRole("employer"),
  getJobApplicants
);


// ================= BOOST JOB (EMPLOYER) =================
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