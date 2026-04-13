const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { findAccountByEmail, findAccountById } = require("./helpers");

const jwtSecret = process.env.JWT_SECRET || "skill_link_jwt_secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false
    },
    async (req, email, password, done) => {
      try {
        const type = req.body.type;
        const account = await findAccountByEmail(type, email);
        if (!account) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        delete account.password;
        return done(null, { ...account, type });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    },
    async (payload, done) => {
      try {
        const account = await findAccountById(payload.type, payload.id);
        if (!account) {
          return done(null, false);
        }

        return done(null, { ...account, type: payload.type });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = {
  passport,
  jwtSecret,
  jwtExpiresIn
};
