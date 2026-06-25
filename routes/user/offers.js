const express = require('express');
const app = express();
const userController = require("../../controllers/user.controller");
const jobController = require("../../controllers/job.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

app.get('/offers', requireAuth, requireRole("user"), userController.listOffers);

app.get('/jobs', requireAuth, requireRole("user"), userController.listMatchingJobs);

app.get('/jobs/:job_id', requireAuth, requireRole("user"), jobController.getJobDetails);

app.post('/jobs/:job_id/offers', requireAuth, requireRole("user"), jobController.applyToJob);

app.post('/jobs/:job_id/submit-completion', requireAuth, requireRole("user"), jobController.submitCompletion);

app.post('/jobs/:job_id/approve-completion', requireAuth, requireRole("user"), jobController.approveCompletion);

module.exports = app;
