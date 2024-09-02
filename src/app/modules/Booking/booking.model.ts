import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    name:{
      type:String,
      required: [true, "Name is required"],
    },
    email:{
      type:String,
      required: [true, "Email is required"],
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
    
    status: {
      type:String,
      enum: ['upcoming' , 'past'],
      default: "upcoming",
    }

  },
  { timestamps: true },
);

export const Booking = model<TBooking>("Booking", bookingSchema);
