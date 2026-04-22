import mongoose from "mongoose";
import Application from "../models/Application.js";
import crypto from "crypto";
import {
  sendApplicationNotification,
  sendAdminNotification,
} from "../utils/mailer.js";


/* ================= CREATE APPLICATION ================= */
export const createApplication = async (req, res) => {
  try {
    const { fullname, email, mobile, jobType, jobPosition } = req.body;

    const emailToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const publicToken = crypto.randomBytes(24).toString("hex");

await Application.create({
  fullname,
  email,
  mobile,
  jobType,
  jobPosition,
  emailToken,
  tokenExpiresAt,
  publicToken, // 🔥 ADD THIS
});

    const accessLink = `${process.env.FRONTEND_URL}/upload/${emailToken}`;

    await sendApplicationNotification({ email, fullname, link: accessLink });
    await sendAdminNotification({ fullname, email, jobType, jobPosition });

    res.status(201).json({
      message: "Application submitted. Check your email.",
    });
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET BY EMAIL TOKEN ================= */
export const getByToken = async (req, res) => {
  try {
    const app = await Application.findOne({ emailToken: req.params.token });

    if (!app) return res.status(404).json({ message: "Invalid link" });
    if (app.tokenExpiresAt < new Date())
      return res.status(400).json({ message: "Link expired" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SAVE CLOUDINARY URLS ================= */
export const uploadCloudUrls = async (req, res) => {
  try {
    const { proofUrl, resumeUrl } = req.body;

    if (!proofUrl || !resumeUrl) {
      return res.status(400).json({ message: "Missing file URLs" });
    }

    const app = await Application.findOne({ emailToken: req.params.token });
    if (!app) return res.status(404).json({ message: "Invalid token" });

    app.proofFile = proofUrl;
    app.resumeFile = resumeUrl;
    app.emailToken = null;
    app.tokenExpiresAt = null;

    await app.save();

    res.json({
      message: "Files saved successfully",
      publicToken: app._id,
    });
  } catch (err) {
    console.error("Save URLs error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};


export const getHistoryByPublicToken = async (req, res) => {
  try {
    const { token } = req.params;

    const application = await Application.findOne({ publicToken: token });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN ================= */
export const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};



import nodemailer from "nodemailer";
import axios from "axios";

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, reply } = req.body;

    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Update fields
    if (status) app.status = status;
    if (reply) app.reply = reply;

    await app.save();

    // =========================
    // 📧 SEND EMAIL
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"JobLink" <${process.env.EMAIL_USER}>`,
      to: app.email,
      subject: "Application Update",
      html: `
        <h3>Hello ${app.fullname}</h3>

        <p>Your application status is now: <b>${app.status}</b></p>

        ${
          app.reply
            ? `<p><b>Admin Reply:</b> ${app.reply}</p>`
            : ""
        }

        <p>Click below to view your application:</p>

        <a 
          href="${process.env.FRONTEND_URL}/#/history/${app._id}" 
          style="
            display:inline-block;
            padding:10px 15px;
            background:#22c55e;
            color:white;
            text-decoration:none;
            border-radius:5px;
          "
        >
          View Your Application
        </a>
      `,
    });

    // =========================
    // 📱 WHATSAPP (optional)
    // =========================
    if (app.mobile) {
      try {
        await axios.post(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: app.mobile,
            type: "text",
            text: {
              body: `Hello ${app.fullname}, your application status is ${app.status}.
${
  app.reply ? "Reply: " + app.reply : ""
}
View: ${process.env.FRONTEND_URL}/#/history/${app._id}`,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.log("WhatsApp failed:", err.message);
      }
    }

    res.json({
      message: "Updated successfully",
      application: app,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update" });
  }
};