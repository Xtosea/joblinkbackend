import Job from "../models/postJob.js";
import JobApplication from "../models/JobApplication.js";
import role from "../models/role";

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

    const application = await JobApplication.create({
      job: job._id,
      jobTitle: job.title || "Unknown Role", // ✅ FIX
      name,
      email,
      cvUrl, // ✅ CHANGE THIS (IMPORTANT)
      appliedAt: new Date(),
    });

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


// GET /api/jobs/types
export const getJobTypes = async (req, res) => {
  try {
    const types = await Job.aggregate([
      {
        $group: {
          _id: "$jobType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(types);
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

export const getJobs = async (req, res) => {
  try {
    const { jobType, category, search } = req.query;

    let filter = {};

    if (jobType) {
      filter.jobType = jobType;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({
      isFeatured: -1,
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const applicants = await JobApplication.find({ job: jobId })
      .sort({ appliedAt: -1 })
      .populate("job");

    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};