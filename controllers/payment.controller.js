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
    payment_method: joi.string().optional()
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
    ...validation.value,
    owner_type: req.account.type,
    owner_id: req.account.id
  });

  if (!payment.success) {
    return res.status(400).send({
      success: false,
      message: "Payment failed",
      data: payment
    });
  }

  const wallet = await Wallet.addBalance(
    req.account.type,
    req.account.id,
    validation.value.amount,
    `Sudo payment ${payment.transaction_id}`
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
