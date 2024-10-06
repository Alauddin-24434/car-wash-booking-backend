"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    transactionId: { type: String, required: true },
    bookingId: { type: String, required: true },
    amount: { type: Number, required: true },
    name: {
        type: String,
        required: [true, "User name is required"],
    },
    email: {
        type: String,
        required: [true, "User email is required"],
    },
    phone: {
        type: String,
        required: [true, "User phone is required"],
    },
    address: {
        type: String,
        required: [true, "User address is required"],
    },
    paymentStatus: { type: String, required: true },
});
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema); // Corrected export name
