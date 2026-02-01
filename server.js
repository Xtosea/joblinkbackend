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
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

console.log("✅ Allowed CORS origins:", allowedOrigins);

// ================== Dynamic CORS Setup ==================
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow exact matches from whitelist
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow all Vercel preview URLs
    if (origin.endsWith(".vercel.app")) return callback(null, true);

    // Allow all subdomains of globelynks.com
    if (/^https?:\/\/.*\.globelynks\.com$/.test(origin)) return callback(null, true);

    console.warn("❌ Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // needed if using cookies/auth headers
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

// ================== Test Route ==================
app.get("/test", (req, res) => {
  res.json({
    message: "Backend connected successfully!",
    originReceived: req.headers.origin, // debug
  });
});

// ================== Routes ==================
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// ================== MongoDB Connection ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================== Start Server ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});