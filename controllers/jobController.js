import Job from "../models/postJob.js";
import JobApplication from "../models/JobApplication.js";

/* =========================
   FEATURED EXPIRY CHECK
========================= */
export const checkFeaturedExpiry = async () => {
  const now = new Date();

  await Job.updateMany(
    {
      isFeatured: true,
      featuredUntil: { $lt: now },
    },
    {
      isFeatured: false,
      planType: "free",
    }
  );
};

/* =========================
   GET ALL JOBS
========================= */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({
      isFeatured: -1,
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET SINGLE JOB
========================= */
export const getJobById = async (req, res) => {
  try {
    await checkFeaturedExpiry();

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.views += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CREATE JOB
========================= */
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      jobType,
      salary,
      postedBy,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      location,
      jobType,
      salary,
      postedBy,
      planType: "free",
      isFeatured: false,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   APPLY TO JOB (FINAL FIXED)
========================= */
export const applyToJob = async (req, res) => {
  try {
    const { name, email, cvUrl } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 💾 Save application in separate collection (BEST PRACTICE)
    const application = await JobApplication.create({
      job: job._id,
      jobTitle: job.title,
      name,
      email,
      cvFile: cvUrl,
      appliedAt: new Date(),
    });

    // 📊 update stats
    job.applicationsCount += 1;
    await job.save();

    res.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: GET ALL APPLICANTS
========================= */
export const getAllJobApplicants = async (req, res) => {
  try {
    const applicants = await JobApplication.find()
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};