import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    jobType: { 
      type: String, 
      enum: ["Full-time", "Part-time"], 
      required: true 
    },
    jobPosition: { type: String, required: true, trim: true },
    proofFile: { type: String },
    resumeFile: { type: String },
    reply: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["Pending", "Replied", "Approved", "Declined"], 
      default: "Pending" 
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export default mongoose.model("Application", applicationSchema);