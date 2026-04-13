const express = require('express')
const app = express();
const jobController = require("../../controllers/job.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

app.post('/jobs', requireAuth, requireRole("client"), jobController.createJob);

app.get('/jobs', requireAuth, requireRole("client"), jobController.listClientJobs);

app.get('/jobs/:job_id/offers', requireAuth, requireRole("client"), jobController.listOffersForJob);

app.post('/offers/:offer_id/accept', requireAuth, requireRole("client"), jobController.acceptOffer);

app.post('/jobs/:job_id/approve-completion', requireAuth, requireRole("client"), jobController.approveCompletion);

module.exports=app;
