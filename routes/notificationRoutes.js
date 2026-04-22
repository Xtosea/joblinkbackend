import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ notifications });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// MARK AS READ
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

export default router;