import express from "express";
import User from "../models/User.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// GET profile
router.get("/me", isAuth, async (req, res) => {
  res.json(req.user);
});

// UPDATE profile
router.patch("/me", isAuth, async (req, res) => {
  const { fullname, email, mobile } = req.body;
  if (fullname) req.user.fullname = fullname;
  if (email) req.user.email = email;
  if (mobile) req.user.mobile = mobile;
  await req.user.save();
  res.json(req.user);
});

export default router;