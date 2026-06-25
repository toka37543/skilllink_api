const express = require("express");
const app = express();
const savedJobController = require("../../controllers/saved-job.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

// Mounted under the /client prefix (folder name).
app.get("/saved-jobs", requireAuth, requireRole("client"), savedJobController.listSavedJobs);

app.post("/jobs/:job_id/save", requireAuth, requireRole("client"), savedJobController.saveJob);

app.delete("/jobs/:job_id/save", requireAuth, requireRole("client"), savedJobController.unsaveJob);

module.exports = app;
