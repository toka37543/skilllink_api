const joi = require("joi");
const bcrypt = require("bcrypt");
const db = require("../lib/db");

const accountTables = {
  user: "users",
  client: "clients"
};

function getAccountTable(type) {
  return accountTables[type];
}

function createPasswordCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function accountExists(type, email) {
  const table = getAccountTable(type);
  const [rows] = await db.execute(`SELECT id FROM ${table} WHERE email = ? LIMIT 1`, [email]);
  return rows.length > 0;
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
    if (!(await accountExists(type, email))) {
      return res.status(404).send({
        success: false,
        message: "Account not found"
      });
    }

    const code = createPasswordCode();
    const codeHash = await bcrypt.hash(code, 10);

    await db.execute(
      "UPDATE password_codes SET used_at = CURRENT_TIMESTAMP WHERE email = ? AND account_type = ? AND used_at IS NULL",
      [email, type]
    );

    await db.execute(
      "INSERT INTO password_codes (email, account_type, code, expires_at) VALUES (?, ?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE))",
      [email, type, codeHash]
    );

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
  const table = getAccountTable(type);
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [accounts] = await connection.execute(`SELECT id FROM ${table} WHERE email = ? LIMIT 1`, [email]);
    if (accounts.length === 0) {
      await connection.rollback();
      return res.status(404).send({
        success: false,
        message: "Account not found"
      });
    }

    const [codes] = await connection.execute(
      "SELECT id, code FROM password_codes WHERE email = ? AND account_type = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1",
      [email, type]
    );

    if (codes.length === 0) {
      await connection.rollback();
      return res.status(400).send({
        success: false,
        message: "Invalid or expired password reset code"
      });
    }

    const isCodeValid = await bcrypt.compare(code, codes[0].code);
    if (!isCodeValid) {
      await connection.rollback();
      return res.status(400).send({
        success: false,
        message: "Invalid or expired password reset code"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(`UPDATE ${table} SET password = ? WHERE email = ?`, [hashedPassword, email]);
    await connection.execute("UPDATE password_codes SET used_at = CURRENT_TIMESTAMP WHERE id = ?", [codes[0].id]);

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
