const express = require("express");
const router = express.Router();
const { getNotifications } = require("./notification.controller");

router.get("/:userId", getNotifications);

// Mark all notifications as read for current user
router.post("/notification/mark-read/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    await Notification.updateMany(
      { receiver: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking notifications as read", error: err });
  }
});



module.exports = router;
