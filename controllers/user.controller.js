const joi = require("joi");
const User = require("../models/user.model");
const UserProfile = require("../models/user-profile.model");
const Job = require("../models/job.model");
const Offer = require("../models/offer.model");

async function getProfile(req, res) {
  const profile = await UserProfile.findByUserId(req.account.id);

  return res.send({
    success: true,
    data: profile
  });
}

async function getPublicProfile(req, res) {
  const user = await User.findById(req.params.user_id);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found"
    });
  }

  const profile = await UserProfile.findByUserId(req.params.user_id);

  return res.send({
    success: true,
    data: {
      user,
      profile
    }
  });
}

async function updateProfile(req, res) {
  const schema = joi.object({
    first_name: joi.string().optional(),
    last_name: joi.string().optional(),
    country_code: joi.string().optional(),
    phone_number: joi.string().optional(),
    skills: joi.array().items(joi.string()).optional(),
    speciality: joi.string().required(),
    certificates: joi.array().items(joi.object()).optional(),
    university: joi.string().optional(),
    projects: joi.array().items(joi.object()).optional(),
    github_url: joi.string().uri().optional(),
    behance_url: joi.string().uri().optional(),
    linkedin_url: joi.string().uri().optional(),
    social_links: joi.object().optional()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const user = await User.updateProfile(req.account.id, validation.value);
  const profile = await UserProfile.upsert(req.account.id, validation.value);

  return res.send({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
      profile
    }
  });
}

async function listMatchingJobs(req, res) {
  const profile = await UserProfile.findByUserId(req.account.id);
  if (!profile?.speciality) {
    return res.status(400).send({
      success: false,
      message: "Complete your profile speciality before browsing matching jobs"
    });
  }

  return res.send({
    success: true,
    data: await Job.listOpenBySpeciality(profile.speciality)
  });
}

async function listOffers(req, res) {
  return res.send({
    success: true,
    data: await Offer.listByUser(req.account.id)
  });
}

module.exports = {
  getProfile,
  getPublicProfile,
  updateProfile,
  listMatchingJobs,
  listOffers
};
