const MockPaymentGateway = require("./mock-payment-gateway");

// Central place to pick the payment gateway. Today it's always the mock used for
// local development and demos. To plug in a real provider later (Stripe, Paymob,
// etc.), implement the PaymentGateway interface and return it here based on an
// env flag — nothing else in the app needs to change.
function createPaymentGateway() {
  return new MockPaymentGateway();
}

module.exports = {
  createPaymentGateway
};
