class PaymentGateway {
  async charge() {
    throw new Error("charge must be implemented by a payment gateway");
  }
}

module.exports = PaymentGateway;
