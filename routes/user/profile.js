const express = require('express');
const app = express();
const userController = require("../../controllers/user.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { singleProfilePictureUpload } = require("../../lib/file-upload");

app.get('/profile', requireAuth, requireRole("user"), userController.getProfile);

app.put('/profile', requireAuth, requireRole("user"), userController.updateProfile);

app.put('/profile-picture', requireAuth, requireRole("user"), singleProfilePictureUpload, userController.updateProfilePicture);

app.get('/profiles/:user_id', userController.getPublicProfile);

module.exports = app;
