import express from "express";
import {
  getJobs,
  getJobById,
  applyToJob,
  createJob,
} from "../controllers/jobController.js";

const router = express.Router();

// 📄 Get single job (and increment views)
router.get("/:id", getJobById);

// 📥 Apply to job
router.post("/:id/apply", applyToJob);

router.get("/", getJobs);
import { createJob } from "../controllers/jobController.js";

router.post("/", createJob);

export default router;
