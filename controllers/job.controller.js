const joi = require("joi");
const db = require("../lib/db");
const Job = require("../models/job.model");
const Offer = require("../models/offer.model");
const Wallet = require("../models/wallet.model");
const JobFund = require("../models/job-fund.model");
const ChatRoom = require("../models/chat-room.model");
const ChatAttachment = require("../models/chat-attachment.model");
const SavedJob = require("../models/saved-job.model");
const Notification = require("../models/notification.model");

// Single job details. Used by the freelancer job/apply pages. When a user is
// logged in we also tell them whether they have already saved this job.
async function getJobDetails(req, res) {
  const job = await Job.findById(req.params.job_id);
  if (!job) {
    return res.status(404).send({
      success: false,
      message: "Job not found"
    });
  }

  let saved = false;
  if (req.account) {
    saved = await SavedJob.isSaved(req.account.type, req.account.id, job.id);
  }

  return res.send({
    success: true,
    data: { ...job, saved }
  });
}

async function createJob(req, res) {
  const schema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    budget: joi.number().positive().required(),
    speciality: joi.string().required(),
    needed_skills: joi.array().items(joi.string()).required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  try {
    const job = await Job.create(req.account.id, validation.value);

    return res.status(201).send({
      success: true,
      message: "Job created successfully",
      data: job
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message
    });
  }
}

async function listClientJobs(req, res) {
  return res.send({
    success: true,
    data: await Job.listByClient(req.account.id)
  });
}

async function applyToJob(req, res) {
  const schema = joi.object({
    description: joi.string().required(),
    budget: joi.number().positive().required(),
    time_to_finish: joi.string().required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const job = await Job.findById(req.params.job_id);
  if (!job || job.status !== "open") {
    return res.status(404).send({
      success: false,
      message: "Job not found or not available"
    });
  }

  const offer = await Offer.create(req.account.id, req.params.job_id, validation.value);

  // Let the client know a new offer landed on their job.
  await Notification.create({ type: "client", id: job.client_id }, {
    type: "offer_received",
    title: "New offer received",
    body: `You received a new offer on "${job.title}".`,
    link: "/client-home"
  });

  return res.status(201).send({
    success: true,
    message: "Offer sent successfully",
    data: offer
  });
}

async function listOffersForJob(req, res) {
  const job = await Job.findById(req.params.job_id);
  if (!job || job.client_id !== req.account.id) {
    return res.status(404).send({
      success: false,
      message: "Job not found"
    });
  }

  return res.send({
    success: true,
    data: await Offer.listByJob(req.params.job_id)
  });
}

async function acceptOffer(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const offer = await Offer.findByIdWithJob(req.params.offer_id, connection);
    if (!offer || offer.client_id !== req.account.id || offer.job_status !== "open" || offer.status !== "pending") {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Offer not found or not available"
      });
    }

    const clientWallet = await Wallet.holdFunds("client", req.account.id, offer.budget, "job", offer.job_id, connection);
    const jobFund = await JobFund.createHold(offer.job_id, clientWallet.id, offer.budget, connection);
    const acceptedOffer = await Offer.accept(offer.id, connection);

    await Offer.rejectPendingForJob(offer.job_id, offer.id, connection);
    const job = await Job.markOfferAccepted(offer.job_id, offer.id, connection);
    const chatRoom = await ChatRoom.create({
      job_id: offer.job_id,
      offer_id: offer.id,
      client_id: req.account.id,
      user_id: offer.user_id
    }, connection);

    await connection.commit();

    // Tell the freelancer their offer was accepted (best-effort, after commit).
    await Notification.create({ type: "user", id: offer.user_id }, {
      type: "offer_accepted",
      title: "Your offer was accepted",
      body: "A client accepted your offer. A chat room is now open to start the work.",
      link: "/"
    });

    return res.send({
      success: true,
      message: "Offer accepted successfully",
      data: {
        job,
        offer: acceptedOffer,
        job_fund: jobFund,
        chat_room: chatRoom
      }
    });
  } catch (err) {
    await connection.rollback();

    return res.status(400).send({
      success: false,
      message: err.message
    });
  } finally {
    connection.release();
  }
}

async function submitCompletion(req, res) {
  const schema = joi.object({
    files: joi.array().items(joi.object({
      file_name: joi.string().required(),
      file_url: joi.string().required(),
      file_type: joi.string().optional()
    })).min(1).required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const job = await Job.findById(req.params.job_id, connection);
    const offer = job?.accepted_offer_id ? await Offer.findById(job.accepted_offer_id, connection) : null;

    if (!job || job.status !== "in_progress" || !offer || offer.user_id !== req.account.id) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Job not found or not assigned to this user"
      });
    }

    const chatRoom = await ChatRoom.findByJobId(job.id, connection);
    const attachments = [];

    for (const file of validation.value.files) {
      attachments.push(await ChatAttachment.create(chatRoom.id, req.account, {
        ...file,
        purpose: "completion"
      }, connection));
    }

    const updatedJob = await Job.submitCompletion(job.id, validation.value.files, connection);
    await connection.commit();

    return res.send({
      success: true,
      message: "Completion files submitted successfully",
      data: {
        job: updatedJob,
        attachments
      }
    });
  } catch (err) {
    await connection.rollback();

    return res.status(500).send({
      success: false,
      message: err.message
    });
  } finally {
    connection.release();
  }
}

async function approveCompletion(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const job = await Job.findById(req.params.job_id, connection);
    const offer = job?.accepted_offer_id ? await Offer.findById(job.accepted_offer_id, connection) : null;

    if (!job || job.status !== "in_progress" || !job.user_submitted_completion_at || !offer) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Job completion is not ready for approval"
      });
    }

    const isClient = req.account.type === "client" && job.client_id === req.account.id;
    const isUser = req.account.type === "user" && offer.user_id === req.account.id;

    if (!isClient && !isUser) {
      await connection.rollback();
      return res.status(403).send({
        success: false,
        message: "Forbidden"
      });
    }

    let updatedJob = await Job.approveCompletion(job.id, req.account.type, connection);

    if (updatedJob.user_approved_completion_at && updatedJob.client_approved_completion_at) {
      const jobFund = await JobFund.findHeldByJobId(job.id, connection);
      if (!jobFund) {
        throw new Error("Held funds not found");
      }

      const userWallet = await Wallet.findOrCreate("user", offer.user_id, connection);
      await Wallet.releaseHeldToUser(jobFund.client_wallet_id, userWallet.id, jobFund.amount, "job", job.id, connection);
      await JobFund.markReleased(jobFund.id, userWallet.id, connection);
      updatedJob = await Job.markCompleted(job.id, connection);
    }

    await connection.commit();

    return res.send({
      success: true,
      message: "Job completion approved successfully",
      data: updatedJob
    });
  } catch (err) {
    await connection.rollback();

    return res.status(500).send({
      success: false,
      message: err.message
    });
  } finally {
    connection.release();
  }
}

module.exports = {
  getJobDetails,
  createJob,
  listClientJobs,
  applyToJob,
  listOffersForJob,
  acceptOffer,
  submitCompletion,
  approveCompletion
};
