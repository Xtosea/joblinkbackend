import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  jobTitle: String,
  name: String,
  email: String,
  cvUrl: String, // ✅ MUST MATCH
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("JobApplication", jobApplicationSchema);