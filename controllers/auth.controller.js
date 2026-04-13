const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../lib/db");
const { passport, jwtSecret, jwtExpiresIn } = require("../lib/passport");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const Wallet = require("../models/wallet.model");

async function login(req, res, next) {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    type: joi.string().valid("user", "client").required()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  req.body = validation.value;

  return passport.authenticate("login", { session: false }, (err, account, info) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: err.message
      });
    }

    if (!account) {
      return res.status(401).send({
        success: false,
        message: info?.message || "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: account.id,
        email: account.email,
        type: account.type
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        token,
        token_type: "Bearer",
        expires_in: jwtExpiresIn,
        account
      }
    });
  })(req, res, next);
}

async function register(req, res) {
  const schema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    type: joi.string().valid("user", "client").required(),
    country_code: joi.string().optional(),
    phone_number: joi.string().optional(),
    company_name: joi.when("type", {
      is: "client",
      then: joi.string().optional(),
      otherwise: joi.forbidden()
    }),
    company_details: joi.when("type", {
      is: "client",
      then: joi.string().optional(),
      otherwise: joi.forbidden()
    })
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const body = validation.value;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const data = {
      ...body,
      password: hashedPassword
    };

    const account = body.type === "client"
      ? await Client.create(data, connection)
      : await User.create(data, connection);

    await Wallet.findOrCreate(body.type, account.id, connection);
    await connection.commit();

    return res.status(200).send({
      success: true,
      message: `${body.type === "client" ? "Client" : "User"} registered successfully`,
      data: {
        ...account,
        type: body.type
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

module.exports = {
  login,
  register
};
