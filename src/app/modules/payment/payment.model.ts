import { Schema, model } from "mongoose";

export const paymentStatusTypes = ["initiated", "success", "failed", "cancelled"] as const;

const paymentSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatusTypes,
      default: "initiated",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const Payment = model("Payment", paymentSchema);
