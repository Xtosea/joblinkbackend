import express from "express";
import multer from "multer";
import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Multer (temporary storage)
const upload = multer({ dest: "uploads/" });

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------------- CREATE APPLICATION ---------------- */
router.post("/", async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      status: "Pending",
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send auto email with upload link
    const uploadLink = `${process.env.FRONTEND_URL}/upload?id=${application._id}`;
    await transporter.sendMail({
      from: `"JobLink" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Application Received - Next Steps",
      html: `
        <p>Hello ${fullname},</p>
        <p>Your application has been received!</p>
        <p>Please upload your proof of payment and CV here: <a href="${uploadLink}">${uploadLink}</a></p>
        <p>Follow the instructions carefully.</p>
      `,
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET APPLICANT HISTORY ----------------
router.get("/me", isAuth, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET ALL APPLICATIONS (ADMIN) ----------------
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ---------------- UPLOAD FILES ---------------- */
router.patch(
  "/upload/:id",
  upload.fields([
    { name: "proofFile", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const app = await Application.findById(req.params.id);
      if (!app) return res.status(404).json({ message: "Application not found" });

      let proofUrl, resumeUrl;

      if (req.files?.proofFile) {
        const result = await cloudinary.uploader.upload(
          req.files.proofFile[0].path,
          { folder: "applications/proofs" }
        );
        proofUrl = result.secure_url;
      }

      if (req.files?.resumeFile) {
        const result = await cloudinary.uploader.upload(
          req.files.resumeFile[0].path,
          { folder: "applications/resumes" }
        );
        resumeUrl = result.secure_url;
      }

      app.proofFile = proofUrl;
      app.resumeFile = resumeUrl;
      await app.save();

      res.json({ success: true, application: app });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;