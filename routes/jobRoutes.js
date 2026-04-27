
import express from "express";
const router = express.Router();

import {
  getJobs,
  getJobById,
  applyToJob,
  createJob,
  getAllJobApplicants, // ✅ MAKE SURE YOU IMPORT THIS
} from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";
import { checkRole } from "../middleware/checkRole.js";



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

// 🆕 Only employers can post jobs
router.post("/", protect, checkRole("employer"), createJob);

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

router.post("/:id/apply", protect, checkRole("applicant"), applyToJob);

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

      // 7 days boost example
      job.featuredUntil = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );

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

