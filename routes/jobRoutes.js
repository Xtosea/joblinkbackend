import express from "express";
import {
  getJobs,
  getJobById,
  applyToJob,
  createJob,
  getAllJobApplicants, // ✅ MAKE SURE YOU IMPORT THIS
} from "../controllers/jobController.js";

const router = express.Router();

// ================= IMPORTANT: ADMIN ROUTES FIRST =================
router.get("/admin/applicants", getAllJobApplicants);

// 📌 Get all jobs
router.get("/", getJobs);

// 🆕 Create job
router.post("/", createJob);

router.get("/types", getJobTypes); 

// 📄 Get single job
router.get("/:id", getJobById);

// 📥 Apply to job
router.post("/:id/apply", applyToJob);

router.get(
  "/:id/applicants",
  protect,
  checkRole("employer"),
  getJobApplicants
);

router.get(
  "/employer/jobs",
  protect,
  checkRole("employer"),
  getEmployerJobs
);

export default router;