const express = require('express');
const app = express();
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/password.controller");
const accountController = require("../controllers/account.controller");
const { requireAuth } = require("../middleware/auth");


app.post('/auth/login', authController.login);
app.post('/auth/register', authController.register);
app.post('/auth/phone/verify', requireAuth, accountController.verifyPhone);
app.post('/auth/forget-password', passwordController.forgetPassword);
app.post('/auth/reset-password', passwordController.resetPassword);

module.exports = app;
