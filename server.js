// server.js
import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// ✅ Load .env from Render Secret File
dotenv.config({ path: "/etc/secrets/joblink.env" });

const app = express();

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Debug log: check if environment variables are loaded
console.log("ENV CHECK:", {
  MONGO_URI: process.env.MONGO_URI ? "✅" : "❌ Missing",
  JWT_SECRET: process.env.JWT_SECRET ? "✅" : "❌ Missing",
  FRONTEND_URL: process.env.FRONTEND_URL ? "✅" : "❌ Missing",
});

// ✅ Allowed origins (local + live + .env)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://joblinknigeria.vercel.app",
];

// ✅ CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health check route
app.get("/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// ✅ API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));