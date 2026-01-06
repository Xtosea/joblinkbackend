import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "applicant"], default: "applicant" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);