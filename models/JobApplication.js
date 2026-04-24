import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    name: String,
    email: String,
    cvFile: String, // Cloudinary URL

    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);