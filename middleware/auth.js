const { passport } = require("../lib/passport");

function requireAuth(req, res, next) {
  return passport.authenticate("jwt", { session: false }, (err, account) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: err.message
      });
    }

    if (!account) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized"
      });
    }

    req.account = account;
    return next();
  })(req, res, next);
}

function requireRole(type) {
  return (req, res, next) => {
    if (req.account?.type !== type) {
      return res.status(403).send({
        success: false,
        message: "Forbidden"
      });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
