const PaymentGateway = require("./payment-gateway");

/**
 * MockPaymentGateway
 * ------------------
 * A fake payment processor for local development and demos. It does NOT talk to
 * any real bank — instead it returns deterministic results based on the input so
 * the team can demo both successful and failed payments on purpose.
 *
 * How to trigger each outcome (use these in the demo):
 *
 *   Credit card number ............ Result
 *   ----------------------------------------------------
 *   4242 4242 4242 4242 ........... approved (any "normal" card works)
 *   4000 0000 0000 0002 ........... declined  (card_declined)
 *   4000 0000 0000 9995 ........... declined  (insufficient_funds)
 *   4000 0000 0000 0069 ........... declined  (expired_card)
 *   anything failing the Luhn check  declined  (invalid_card)
 *
 * Non-card methods (vodafone / fawry / instapay) are always approved, simulating
 * a manually-confirmed transfer.
 */

// Specific test cards that force a particular decline reason.
const DECLINE_CARDS = {
  "4000000000000002": "card_declined",
  "4000000000009995": "insufficient_funds",
  "4000000000000069": "expired_card"
};

// Standard Luhn checksum — the same check real card forms use.
function passesLuhn(digits) {
  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) {
        value -= 9;
      }
    }
    sum += value;
    double = !double;
  }

  return digits.length >= 12 && sum % 10 === 0;
}

function declined(reason, message) {
  return {
    success: false,
    status: "declined",
    decline_code: reason,
    message
  };
}

class MockPaymentGateway extends PaymentGateway {
  async charge(paymentData) {
    const amount = Number(paymentData.amount);
    const currency = paymentData.currency ?? "USD";
    const method = paymentData.payment_method ?? "creditCard";

    if (!Number.isFinite(amount) || amount <= 0) {
      return declined("invalid_amount", "Amount must be greater than zero");
    }

    // Card payments go through the test-card rules above.
    if (method === "creditCard") {
      const cardNumber = String(paymentData.payment_details?.card_number ?? "").replace(/\D/g, "");

      if (DECLINE_CARDS[cardNumber]) {
        const reason = DECLINE_CARDS[cardNumber];
        return declined(reason, `Card was declined (${reason})`);
      }

      if (!passesLuhn(cardNumber)) {
        return declined("invalid_card", "Card number is invalid");
      }
    }

    // Approved: hand back a transaction reference the caller can store.
    return {
      success: true,
      status: "paid",
      transaction_id: `mock_${method}_${Date.now()}`,
      amount,
      currency,
      method
    };
  }
}

module.exports = MockPaymentGateway;
