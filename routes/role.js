import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    // ✅ ROLE SYSTEM
    role: {
      type: String,
      enum: ["applicant", "employer", "admin"],
      default: "applicant",
    },

    // 🏢 Employer info
    companyName: String,
    companyLogo: String,

    // ❤️ Saved jobs (for applicants)
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);