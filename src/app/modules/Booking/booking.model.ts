import { Schema, model } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: true },

    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bkash", "nagad", "rocket", "aamarpay"],
      default: "cash",
    },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
