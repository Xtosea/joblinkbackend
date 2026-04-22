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

    // Files
    resumeFile: String,
    proofFile: String,

    // Admin reply
    reply: { type: String, default: "" },

    // Status (merged + expanded safely)
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Replied",
        "Shortlisted",
        "Approved",
        "Declined",
      ],
      default: "Pending",
    },

    // 🔑 One-time upload token (for secure actions like proof upload)
    emailToken: { type: String, unique: true },

    tokenExpiresAt: Date,

    // 🔓 Permanent public history token
    publicToken: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);