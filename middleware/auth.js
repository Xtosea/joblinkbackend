import jwt from "jsonwebtoken";
import User from "../models/User.js"; // assuming your admin users are in User model

// ================= VERIFY ADMIN =================
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Only allow admins
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Attach user info to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(401).json({ message: "Unauthorized or token expired" });
  }
};