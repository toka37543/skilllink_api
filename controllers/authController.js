const joi = require("joi");
const jwt = require("jsonwebtoken");
const { passport, jwtSecret, jwtExpiresIn } = require("../lib/passport");

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

module.exports = {
  login
};
