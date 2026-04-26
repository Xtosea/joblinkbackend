import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,

  role: {
    type: String,
    enum: ["applicant", "employer"],
    default: "applicant",
  },

  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

export default mongoose.model("User", userSchema);