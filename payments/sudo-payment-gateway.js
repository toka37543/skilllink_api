// Backward-compatible alias. The gateway was renamed from "sudo" to "mock"
// (a clearer name). Existing imports of SudoPaymentGateway keep working.
module.exports = require("./mock-payment-gateway");
