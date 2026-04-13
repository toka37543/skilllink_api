const express = require('express');
const app = express();
const userController = require("../../controllers/user.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

app.get('/profile', requireAuth, requireRole("user"), userController.getProfile);

app.put('/profile', requireAuth, requireRole("user"), userController.updateProfile);

app.get('/profiles/:user_id', userController.getPublicProfile);

module.exports = app;
