import Job from "../models/postJob.js";



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

