import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    description: String,
    location: String,

    // 👇 NEW FIELDS
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: {
      type: Date,
      default: null,
    },
    planType: {
      type: String,
      enum: ["free", "featured", "premium"],
      default: "free",
    },

    // 📊 Analytics (important for selling premium later)
    views: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },

    // 👤 Owner (company/admin)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);