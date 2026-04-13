const express = require('express');
const app   = express();
const adminController = require("../../controllers/admin.controller");

app.get('/users', adminController.listUsers);

app.get('/users/:id', adminController.getUserById);

module.exports = app;
