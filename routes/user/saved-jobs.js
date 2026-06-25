const express = require("express");
const app = express();
const savedJobController = require("../../controllers/saved-job.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

// Mounted under the /user prefix (folder name).
app.get("/saved-jobs", requireAuth, requireRole("user"), savedJobController.listSavedJobs);

app.post("/jobs/:job_id/save", requireAuth, requireRole("user"), savedJobController.saveJob);

app.delete("/jobs/:job_id/save", requireAuth, requireRole("user"), savedJobController.unsaveJob);

module.exports = app;
