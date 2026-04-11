const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const bcrypt = require("bcrypt");
const db = require("./db");

const jwtSecret = process.env.JWT_SECRET || "skill_link_jwt_secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

const accountTables = {
  user: "users",
  client: "clients"
};

function getAccountTable(type) {
  return accountTables[type];
}

function getAccountColumns(type, includePassword = false) {
  const columns = [
    "id",
    "first_name",
    "last_name",
    "email",
    "country_code",
    "phone_number"
  ];

  if (type === "client") {
    columns.push("company_name", "company_details");
  }

  if (includePassword) {
    columns.push("password");
  }

  return columns.join(", ");
}

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
        const table = getAccountTable(type);

        if (!table) {
          return done(null, false, { message: "Invalid account type" });
        }

        const [rows] = await db.execute(
          `SELECT ${getAccountColumns(type, true)} FROM ${table} WHERE email = ? LIMIT 1`,
          [email]
        );

        if (rows.length === 0) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const account = rows[0];
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
        const table = getAccountTable(payload.type);

        if (!table) {
          return done(null, false);
        }

        const [rows] = await db.execute(
          `SELECT ${getAccountColumns(payload.type)} FROM ${table} WHERE id = ? LIMIT 1`,
          [payload.id]
        );

        if (rows.length === 0) {
          return done(null, false);
        }

        return done(null, { ...rows[0], type: payload.type });
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
