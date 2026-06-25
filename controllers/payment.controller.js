const joi = require("joi");
const { createPaymentGateway } = require("../payments");
const Wallet = require("../models/wallet.model");

async function getWallet(req, res) {
  return res.send({
    success: true,
    data: await Wallet.findOrCreate(req.account.type, req.account.id)
  });
}

async function topUpWallet(req, res) {
  const schema = joi.object({
    amount: joi.number().positive().required(),
    currency: joi.string().default("USD"),
    payment_method: joi.string().default("creditCard"),
    // Card / transfer details forwarded to the (mock) gateway. Kept loose so the
    // frontend can send method-specific fields (card_number, mobile, etc.).
    payment_details: joi.object().unknown(true).optional(),
    // Optional context from the Payment screen — accepted but not required.
    offer_id: joi.any().optional(),
    project_title: joi.string().allow(null, "").optional(),
    freelancer_name: joi.string().allow(null, "").optional()
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({
      success: false,
      message: validation.error.message
    });
  }

  const gateway = createPaymentGateway();
  const payment = await gateway.charge({
    amount: validation.value.amount,
    currency: validation.value.currency,
    payment_method: validation.value.payment_method,
    payment_details: validation.value.payment_details,
    owner_type: req.account.type,
    owner_id: req.account.id
  });

  if (!payment.success) {
    // Surface the gateway's human-readable reason so the UI can show it.
    return res.status(400).send({
      success: false,
      message: payment.message || "Payment failed",
      data: payment
    });
  }

  const wallet = await Wallet.addBalance(
    req.account.type,
    req.account.id,
    validation.value.amount,
    `Mock payment ${payment.transaction_id}`
  );

  return res.send({
    success: true,
    message: "Wallet topped up successfully",
    data: {
      payment,
      wallet
    }
  });
}

module.exports = {
  getWallet,
  topUpWallet
};
