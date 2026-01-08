import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

// ✅ Verify token (works for any logged-in user or admin)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded token (id, etc.)
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Restrict access to admins only
export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized - no user ID" });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied - admin only" });
    }

    next();
  } catch (err) {
    console.error("Admin verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Alias (for compatibility with older routes)
export const protect = verifyToken;