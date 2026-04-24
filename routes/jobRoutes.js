import express from "express";
import {
  getJobById,
  applyToJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/:id", getJobById);
router.post("/:id/apply", applyToJob);

export default router;