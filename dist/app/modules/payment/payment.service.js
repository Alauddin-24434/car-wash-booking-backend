"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndUpdatePaymentStatus = exports.createPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("../Booking/booking.model");
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const createPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the booking by ID
    const findBooking = yield booking_model_1.Booking.findById(bookingId);
    if (!findBooking) {
        throw new Error("Booking not found");
    }
    // Extract booking details
    const { name, email, phone, address, totalPrice: amount, paymentStatus } = findBooking;
    // Generate a unique transaction ID
    const transactionId = `TXN-${Date.now()}`;
    // Call the payment gateway's initiatePayment function
    const paymentResponse = yield (0, payment_utils_1.initiatePayment)(transactionId, name, email, phone, address, amount);
    console.log(paymentResponse);
    // Save the payment details in the Payment model
    const newPayment = new payment_model_1.Payment({
        transactionId,
        bookingId,
        amount,
        name,
        email,
        phone,
        address,
        paymentStatus,
    });
    yield newPayment.save();
    return paymentResponse;
});
exports.createPayment = createPayment;
const verifyAndUpdatePaymentStatus = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Step 1: Verify payment with AmarPay (or another payment gateway)
        const verificationResponse = yield (0, payment_utils_1.verifyPaymentWithAmarPay)(transactionId);
        console.log('AmarPay verification response:', verificationResponse);
        // Step 2: Find the payment in the database
        const payment = yield payment_model_1.Payment.findOne({ transactionId }).session(session);
        if (!payment) {
            console.log('Payment not found');
            throw new Error('Payment not found');
        }
        // Step 3: Check the verification response and update the payment status
        if (verificationResponse && verificationResponse.pay_status === 'Successful') {
            payment.paymentStatus = 'successful';
            console.log('Payment status set to successful');
            // Update the booking's payment status to "paid"
            yield booking_model_1.Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: 'paid', transactionId }, { session });
            console.log('Booking payment status updated to paid');
        }
        else {
            payment.paymentStatus = 'failed';
            console.log('Payment status set to failed');
        }
        // Step 4: Save the updated payment status in the database
        yield payment.save({ session });
        console.log('Updated payment saved:', payment);
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return payment;
    }
    catch (error) {
        // Abort the transaction if an error occurred
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.verifyAndUpdatePaymentStatus = verifyAndUpdatePaymentStatus;
