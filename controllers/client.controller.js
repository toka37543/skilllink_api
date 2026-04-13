const joi = require("joi");
const Client = require("../models/client.model");

async function index(req, res) {
  res.end("client API");
}

async function getProfile(req, res) {
  const client = await Client.findById(req.account.id);

  return res.send({
    success: true,
    data: client
  });
}

async function updateProfile(req, res) {
  const schema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    country_code: joi.string().optional(),
    phone_number: joi.string().optional(),
    company_name: joi.string().optional(),
    company_details: joi.string().optional()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const client = await Client.updateProfile(req.account.id, validation.value);

  return res.send({
    success: true,
    message: "Client profile updated successfully",
    data: client
  });
}

module.exports = {
  index,
  getProfile,
  updateProfile
};
