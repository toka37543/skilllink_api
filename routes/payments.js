const express = require("express");
const app = express();
const paymentController = require("../controllers/payment.controller");
const { requireAuth } = require("../middleware/auth");

app.get("/payments/wallet", requireAuth, paymentController.getWallet);

app.post("/payments/top-up", requireAuth, paymentController.topUpWallet);

module.exports = app;
