import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, not authorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔥 Try Admin first
    let admin = await Admin.findById(decoded.id).select("-password");
    if (admin) {
      req.admin = admin;
      req.user = null;
      req.role = "admin";
      return next();
    }

    // 🔥 Then try normal User
    let user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      req.admin = null;
      req.role = user.role || "user"; // assuming you store role
      return next();
    }

    return res.status(401).json({ message: "User not found" });

  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Token failed" });
  }
};import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, not authorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // 👈 attach user
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};