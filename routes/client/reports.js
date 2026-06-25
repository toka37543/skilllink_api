const express = require("express");
const app = express();
const reportController = require("../../controllers/report.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

// Mounted under the /client prefix (folder name).
app.get("/reports", requireAuth, requireRole("client"), reportController.listReports);

app.post("/reports", requireAuth, requireRole("client"), reportController.submitReport);

module.exports = app;
