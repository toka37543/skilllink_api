const joi = require("joi");
const User = require("../models/user.model");
const Client = require("../models/client.model");

const LOCAL_PHONE_OTP = process.env.PHONE_VERIFICATION_OTP || "123456";

function getAccountModel(type) {
  return type === "client" ? Client : User;
}

async function verifyPhone(req, res) {
  const schema = joi.object({
    country_code: joi.string().required(),
    phone_number: joi.string().required(),
    otp: joi.string().required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  if (validation.value.otp !== LOCAL_PHONE_OTP) {
    return res.status(400).send({
      success: false,
      message: "Invalid phone verification OTP"
    });
  }

  const Account = getAccountModel(req.account.type);
  const account = await Account.updatePhone(req.account.id, validation.value);

  return res.send({
    success: true,
    message: "Phone number verified and updated successfully",
    data: {
      ...account,
      type: req.account.type
    }
  });
}

module.exports = {
  verifyPhone
};
