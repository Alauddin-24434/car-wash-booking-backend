import { model, Schema } from "mongoose";
import { TPaymentData } from "./payment.interface";

const PaymentSchema = new Schema<TPaymentData>({
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

export const Payment = model<TPaymentData>('Payment', PaymentSchema); // Corrected export name
