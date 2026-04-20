const express = require('express');
const app = express();
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/password.controller");


app.post('/auth/login', authController.login);
app.post('/auth/register', authController.register);
app.post('/auth/forget-password', passwordController.forgetPassword);
app.post('/auth/reset-password', passwordController.resetPassword);

module.exports = app;
