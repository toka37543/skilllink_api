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
    first_name: joi.string().allow(null, "").optional(),
    last_name: joi.string().allow(null, "").optional(),
    skills: joi.array().items(joi.string()).allow(null).optional(),
    speciality: joi.string().allow(null, "").optional(),
    certificates: joi.array().items(joi.object()).allow(null).optional(),
    university: joi.string().allow(null, "").optional(),
    college: joi.string().allow(null, "").optional(),
    study_years: joi.string().allow(null, "").optional(),
    date_of_birth: joi.date().iso().allow(null).optional(),
    address: joi.string().allow(null, "").optional(),
    languages: joi.array().items(joi.string()).allow(null).optional(),
    brief: joi.string().allow(null, "").optional(),
    projects: joi.array().items(joi.object()).allow(null).optional(),
    github_url: joi.string().uri().allow(null, "").optional(),
    behance_url: joi.string().uri().allow(null, "").optional(),
    linkedin_url: joi.string().uri().allow(null, "").optional(),
    social_links: joi.object().allow(null).optional()
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

async function updateProfilePicture(req, res) {
  if (!req.uploadedFile) {
    return res.status(400).send({
      success: false,
      message: "Missing profile picture upload"
    });
  }

  const baseUrl = (process.env.API_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  const profilePictureUrl = `${baseUrl}${req.uploadedFile.publicPath}`;
  const profile = await UserProfile.updateProfilePicture(
    req.account.id,
    profilePictureUrl
  );

  return res.send({
    success: true,
    message: "Profile picture updated successfully",
    data: {
      profile,
      file: {
        url: profilePictureUrl,
        path: req.uploadedFile.publicPath,
        mime_type: req.uploadedFile.mimeType,
        size: req.uploadedFile.size
      }
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
  updateProfilePicture,
  listMatchingJobs,
  listOffers
};
