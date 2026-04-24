import express from "express";
import {
  getJobs,
  getJobById,
  applyToJob,
  createJob,
} from "../controllers/jobController.js";

const router = express.Router();

// 📌 Get all jobs
router.get("/", getJobs);

// 📄 Get single job
router.get("/:id", getJobById);

// 📥 Apply to job
router.post("/:id/apply", applyToJob);

// 🆕 Create job
router.post("/", createJob);
router.post("/:id/apply", applyToJob);

export default router;