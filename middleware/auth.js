import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check admin
    const admin = await Admin.findById(decoded.id).select("-password");
    if (admin) {
      req.admin = admin;
      req.role = "admin";
      return next();
    }

    // Check user
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      req.role = user.role;
      return next();
    }

    return res.status(401).json({ message: "User not found" });

  } catch (err) {
    return res.status(401).json({ message: "Token failed" });
  }
};