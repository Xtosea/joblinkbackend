import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins (local + live + .env)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // dynamic frontend URL
  "https://joblinknigeria.vercel.app",
];

// ✅ CORS middleware (handles browser + Postman)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server requests like Postman

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// ================= API ROUTES =================
app.use("/api/auth", authRoutes); // login/register for applicants/admins
app.use("/api/applications", applicationRoutes); // applicant submission + admin management
app.use("/api/admin", adminRoutes);

// ================= MONGODB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));