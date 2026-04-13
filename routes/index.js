const express = require("express");
const app = express();
const rootController = require("../controllers/root.controller");

// GET /
app.get("/", rootController.index);

module.exports = app;

