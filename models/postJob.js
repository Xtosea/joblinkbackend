import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    description: String,
    location: String,

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

    views: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },

    jobType: String,
    salary: String,

    applicants: [
      {
        name: String,
        email: String,
        cvUrl: String,
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);