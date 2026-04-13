const express = require('express');
const app = express();
const clientController = require("../../controllers/client.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

app.get('/profile', requireAuth, requireRole("client"), clientController.getProfile);

app.put('/profile', requireAuth, requireRole("client"), clientController.updateProfile);

module.exports = app;
