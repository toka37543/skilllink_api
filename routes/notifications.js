const express = require("express");
const app = express();
const notificationController = require("../controllers/notification.controller");
const { requireAuth } = require("../middleware/auth");

// Top-level route file (no folder prefix), so paths are absolute.
// Notifications belong to whichever account is logged in (user or client).
app.get("/notifications", requireAuth, notificationController.listNotifications);

app.put("/notifications/:id/read", requireAuth, notificationController.markRead);

module.exports = app;
