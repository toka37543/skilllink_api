const PaymentGateway = require("./payment-gateway");

class SudoPaymentGateway extends PaymentGateway {
  async charge(paymentData) {
    return {
      success: true,
      transaction_id: `sudo_${Date.now()}`,
      amount: paymentData.amount,
      currency: paymentData.currency ?? "USD",
      status: "paid"
    };
  }
}

module.exports = SudoPaymentGateway;
