import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Application from "../models/Application.js";
import nodemailer from "nodemailer";

/* ======================
   📧 EMAIL SETUP
====================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ======================
   🔐 ADMIN LOGIN
====================== */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name || "Admin",
    },
  });
});

/* ======================
   📋 GET ALL APPLICATIONS
====================== */
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find().sort({ createdAt: -1 });
  res.json(applications);
});

/* ======================
   📄 GET APPLICATION BY ID
====================== */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  res.json(application);
});

/* ======================
   ✏️ UPDATE APPLICATION
====================== */
export const updateApplication = asyncHandler(async (req, res) => {
  const { reply, status } = req.body;

  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (reply !== undefined) application.reply = reply;
  if (status !== undefined) application.status = status;

  await application.save();

  res.json({
    message: "Application updated successfully",
    application,
  });
});

/* ======================
   🔁 RESEND APPLICATION EMAIL
====================== */
export const resendEmail = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (!application.emailToken) {
    res.status(400);
    throw new Error("No email token found");
  }

  const link = `${process.env.FRONTEND_URL}/upload/${application.emailToken}`;

  // ✅ Use Brevo instead of nodemailer
  await sendApplicationNotification({
    email: application.email,
    fullname: application.fullname,
    link,
  });

  res.json({ message: "Email resent successfully" });
});