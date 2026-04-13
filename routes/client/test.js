const express = require("express")
const app = express();
const clientController = require("../../controllers/client.controller");

app.get("/", clientController.index);

module.exports = app;
