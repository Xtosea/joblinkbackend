import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// ================= Fix __dirname (ES Modules) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== Allowed Origins ==================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://joblinks.globelynks.com",
  "https://jobapplication.globelynks.com",
  
];

console.log("✅ Allowed CORS origins:", allowedOrigins);

// ================== CORS Setup ==================
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman / server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.warn("❌ Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: false, // JWT in headers does not need cookies
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// ================== Middleware ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== Static Files ==================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== Routes ==================
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// ================== MongoDB Connection ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ================== Start Server ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));