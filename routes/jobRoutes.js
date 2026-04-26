import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  getJobTypes,
  getAllJobApplicants,
  getJobApplicants,
  getEmployerJobs,
} from "../controllers/jobController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   📌 PUBLIC ROUTES
========================= */

// 🔍 Get all jobs
router.get("/", getJobs);

// 📄 Get single job
router.get("/:id", getJobById);

// 📊 Get job types
router.get("/types/all", getJobTypes);

// 📥 Apply to job
router.post("/:id/apply", applyToJob);


/* =========================
   🔐 EMPLOYER ROUTES
========================= */

// ➕ Create job
router.post("/", protect, createJob);

// 📦 Get employer's jobs
router.get("/employer/jobs", protect, getEmployerJobs);

// 👥 Get applicants for a job
router.get("/:id/applicants", protect, getJobApplicants);


/* =========================
   🔐 ADMIN ROUTES
========================= */

// 🧾 Get all applicants (admin)
router.get("/admin/applicants", protect, getAllJobApplicants);


export default router;