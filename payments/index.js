const SudoPaymentGateway = require("./sudo-payment-gateway");

function createPaymentGateway() {
  return new SudoPaymentGateway();
}

module.exports = {
  createPaymentGateway
};
