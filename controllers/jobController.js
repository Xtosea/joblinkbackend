import Job from "../models/postJob.js";
import JobApplication from "../models/JobApplication.js";

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



export const getJobById = async (req, res) => {
  try {
    // 👇 expire old featured jobs first
    await checkFeaturedExpiry();

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 📊 increment views
    job.views += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 👉 increment applications
    job.applicationsCount += 1;
    await job.save();

    // (Optional) save applicant details later
    // e.g. name, email, CV

    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ isFeatured: -1, createdAt: -1 });
  res.json(jobs);
};


// 📌 Create Job (FREE or PREMIUM later)
export const createJob = async (req, res) => {
  try {
    const {
  title,
  company,
  description,
  location,
  jobType,
  salary,
  postedBy
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
}


export const applyToJob = async (req, res) => {
  try {
    const { name, email, cvUrl } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 💾 Save application
    const application = await JobApplication.create({
      job: job._id,
      name,
      email,
      cvFile: cvUrl,
    });

    // 📊 increment count
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

export const applyToJob = async (req, res) => {
  try {
    const { name, email, cvUrl } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Save applicant
    job.applicants.push({
      name,
      email,
      cvUrl,
    });

    job.applicationsCount += 1;

    await job.save();

    res.json({ message: "Application submitted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};