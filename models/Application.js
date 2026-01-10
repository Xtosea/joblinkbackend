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

    // 🔑 Email access token
    emailToken: { type: String, required: true, unique: true },
    tokenExpiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);