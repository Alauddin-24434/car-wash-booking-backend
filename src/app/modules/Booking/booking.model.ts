import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"],
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot ID is required"],
    },


  },
  { timestamps: true },
);

export const Booking = model<TBooking>("Booking", bookingSchema);
