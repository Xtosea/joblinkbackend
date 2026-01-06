import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    jobType: { 
      type: String, 
      enum: ["Full-time", "Part-time"], 
      required: true 
    },
    jobPosition: { type: String, required: true, trim: true },
    proofFile: { type: String },  // Firebase URL for proof
    resumeFile: { type: String }, // Firebase URL for resume
    reply: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["Pending", "Replied", "Approved", "Declined"], 
      default: "Pending" 
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model("Application", applicationSchema);