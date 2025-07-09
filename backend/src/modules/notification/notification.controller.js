const Notification = require("./notification.model");

exports.getNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "name")
      .sort({ createdAt: -1 }); // newest first

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};
