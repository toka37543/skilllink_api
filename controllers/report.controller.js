const joi = require("joi");
const Report = require("../models/report.model");

// Shared by /user/reports and /client/reports — the reporter is taken from the
// authenticated account, so a user can only ever see their own reports.

async function listReports(req, res) {
  return res.send({
    success: true,
    data: await Report.listByReporter(req.account.type, req.account.id)
  });
}

async function submitReport(req, res) {
  const schema = joi.object({
    name: joi.string().allow(null, "").optional(),
    email: joi.string().email().allow(null, "").optional(),
    issue_type: joi.string().allow(null, "").optional(),
    description: joi.string().min(1).required(),
    attachment_url: joi.string().uri().allow(null, "").optional()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const report = await Report.create(req.account, validation.value);

  return res.status(201).send({
    success: true,
    message: "Report submitted successfully",
    data: report
  });
}

module.exports = {
  listReports,
  submitReport
};
