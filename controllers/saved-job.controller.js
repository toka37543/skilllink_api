const Job = require("../models/job.model");
const SavedJob = require("../models/saved-job.model");

// These handlers work for both account types: `req.account.type` ("user" or
// "client") is used as the owner, so the same code backs /user/* and /client/*.

async function listSavedJobs(req, res) {
  return res.send({
    success: true,
    data: await SavedJob.listJobsForOwner(req.account.type, req.account.id)
  });
}

async function saveJob(req, res) {
  const job = await Job.findById(req.params.job_id);
  if (!job) {
    return res.status(404).send({
      success: false,
      message: "Job not found"
    });
  }

  await SavedJob.save(req.account.type, req.account.id, job.id);

  return res.status(201).send({
    success: true,
    message: "Job saved successfully",
    data: { job_id: job.id, saved: true }
  });
}

async function unsaveJob(req, res) {
  await SavedJob.unsave(req.account.type, req.account.id, req.params.job_id);

  return res.send({
    success: true,
    message: "Job removed from saved list",
    data: { job_id: Number(req.params.job_id), saved: false }
  });
}

module.exports = {
  listSavedJobs,
  saveJob,
  unsaveJob
};
