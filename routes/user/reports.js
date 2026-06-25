const express = require("express");
const app = express();
const reportController = require("../../controllers/report.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

// Mounted under the /user prefix (folder name).
app.get("/reports", requireAuth, requireRole("user"), reportController.listReports);

app.post("/reports", requireAuth, requireRole("user"), reportController.submitReport);

module.exports = app;
