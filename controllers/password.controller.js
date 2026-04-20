const joi = require("joi");
const bcrypt = require("bcrypt");
const db = require("../lib/db");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const PasswordCode = require("../models/password-code.model");

function createPasswordCode() {
  return 123456:
  // return String(Math.floor(100000 + Math.random() * 900000));
}

async function findAccount(type, email, connection = db) {
  return type === "client"
    ? Client.findByEmail(email, connection)
    : User.findByEmail(email, connection);
}

async function updatePassword(type, email, password, connection = db) {
  if (type === "client") {
    return Client.updatePassword(email, password, connection);
  }

  return User.updatePassword(email, password, connection);
}

async function forgetPassword(req, res) {
  const schema = joi.object({
    email: joi.string().email().required(),
    type: joi.string().valid("user", "client").required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const { email, type } = validation.value;

  try {
    if (!(await findAccount(type, email))) {
      return res.status(404).send({
        success: false,
        message: "Account not found"
      });
    }

    const code = createPasswordCode();
    const codeHash = await bcrypt.hash(code, 10);

    await PasswordCode.expireActive(email, type);
    await PasswordCode.create({
      email,
      account_type: type,
      code: codeHash
    });

    return res.status(200).send({
      success: true,
      message: "Password reset code created successfully",
      data: {
        email,
        type,
        code,
        expires_in_minutes: 15
      }
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message
    });
  }
}

async function resetPassword(req, res) {
  const schema = joi.object({
    email: joi.string().email().required(),
    type: joi.string().valid("user", "client").required(),
    code: joi.string().pattern(/^[0-9]{6}$/).required(),
    password: joi.string().min(8).required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const { email, type, code, password } = validation.value;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const account = await findAccount(type, email, connection);
    if (!account) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Account not found"
      });
    }

    const passwordCode = await PasswordCode.findActiveLatest(email, type, connection);
    if (!passwordCode) {
      await connection.rollback();
      return res.status(400).send({
        success: false,
        message: "Invalid or expired password reset code"
      });
    }

    const isCodeValid = await bcrypt.compare(code, passwordCode.code);
    if (!isCodeValid) {
      await connection.rollback();
      return res.status(400).send({
        success: false,
        message: "Invalid or expired password reset code"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updatePassword(type, email, hashedPassword, connection);
    await PasswordCode.markUsed(passwordCode.id, connection);

    await connection.commit();

    return res.status(200).send({
      success: true,
      message: "Password reset successfully"
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }

    return res.status(500).send({
      success: false,
      message: err.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  forgetPassword,
  resetPassword
};
