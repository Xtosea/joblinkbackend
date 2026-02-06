import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time"],
      required: true,
    },

    jobPosition: { type: String, required: true, trim: true },

    proofFile: String,
    resumeFile: String,

    reply: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Replied", "Approved", "Declined"],
      default: "Pending",
    },

    // 🔑 One-time upload token
    emailToken: { type: String, unique: true },
    tokenExpiresAt: Date,

    // 🔓 Permanent history token
    publicToken: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);