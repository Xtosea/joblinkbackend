// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// CREATE APPLICATION
router.post("/", async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    const application = await Application.create({
      fullname,
      email,
      mobile,
      jobType,
      jobPosition,
      status: "Pending",
    });

    // Return only what frontend needs
    res.status(201).json({ _id: application._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;