const express = require('express');
const app = express();
const userController = require("../../controllers/user.controller");
const accountController = require("../../controllers/account.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { singleProfilePictureUpload } = require("../../lib/file-upload");

app.get('/profile', requireAuth, requireRole("user"), userController.getProfile);

app.put('/profile', requireAuth, requireRole("user"), userController.updateProfile);

app.post('/profile/phone/send-otp', requireAuth, requireRole("user"), accountController.sendPhoneOtp);

app.put('/profile/phone/verify', requireAuth, requireRole("user"), accountController.verifyPhone);

app.put('/profile-picture', requireAuth, requireRole("user"), singleProfilePictureUpload, userController.updateProfilePicture);

app.get('/profiles/:user_id', userController.getPublicProfile);

module.exports = app;
