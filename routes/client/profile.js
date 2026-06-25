const express = require('express');
const app = express();
const clientController = require("../../controllers/client.controller");
const accountController = require("../../controllers/account.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { singleProfilePictureUpload } = require("../../lib/file-upload");

app.get('/profile', requireAuth, requireRole("client"), clientController.getProfile);

app.put('/profile', requireAuth, requireRole("client"), clientController.updateProfile);

app.put('/profile-picture', requireAuth, requireRole("client"), singleProfilePictureUpload, clientController.updateProfilePicture);

app.post('/profile/phone/send-otp', requireAuth, requireRole("client"), accountController.sendPhoneOtp);

app.put('/profile/phone/verify', requireAuth, requireRole("client"), accountController.verifyPhone);

module.exports = app;
