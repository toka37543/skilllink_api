const Notification = require("../models/notification.model");

async function listNotifications(req, res) {
  const [items, unreadCount] = await Promise.all([
    Notification.listForRecipient(req.account.type, req.account.id),
    Notification.countUnread(req.account.type, req.account.id)
  ]);

  return res.send({
    success: true,
    data: {
      items,
      unread_count: unreadCount
    }
  });
}

async function markRead(req, res) {
  const updated = await Notification.markRead(req.params.id, req.account.type, req.account.id);
  if (!updated) {
    return res.status(404).send({
      success: false,
      message: "Notification not found"
    });
  }

  return res.send({
    success: true,
    message: "Notification marked as read"
  });
}

module.exports = {
  listNotifications,
  markRead
};
