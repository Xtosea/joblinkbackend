import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js"; // we'll create this
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});