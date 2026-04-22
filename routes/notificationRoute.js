import Notification from "../models/Notification.js";

router.patch("/applications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // 🔔 CREATE NOTIFICATION
    await Notification.create({
      message: `Application ${updated.fullname} changed to ${status}`,
      type: "status",
    });

    res.json({
      message: "Status updated",
      application: updated,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});