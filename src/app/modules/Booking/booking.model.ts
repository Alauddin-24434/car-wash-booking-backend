import { model, Schema, Document } from "mongoose";
import { TBookingService, TBooking, TBookingUser } from "./booking.interface";

// Create a schema for TBookingService
const bookingServiceSchema = new Schema<TBookingService>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"],
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot ID is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    status: {
      type: String,
      enum: ["upcoming", "past"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);





// Create a schema for TBooking
const bookingSchema = new Schema<TBooking & Document>(
  {
   userId:{
    type: String,
    required: [true, "UserId is required"],
   },

    name: {
      type: String,
      required: [true, "User name is required"],
    },
    email:{
      type: String,
      required: [true, "User email is required"],
    },
    phone: {
      type: String,
      required: [true, "User phone is required"],
    },
    address:{
      type: String,
      required: [true, "User address is required"],
    },
    status:{
      type:String,
      enum:["past", "upcoming"],
      default:"upcoming",
     
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "paid", "failed" ],
      default: "pending",
    },
    bookingService: [bookingServiceSchema], // Use the bookingServiceSchema to define an array of booking services
    totalPrice:{
      type: Number,
      required: [true, "Total Price is required"],
    },
    isDeleted: { type: Boolean, default: false },
  },
 
  { timestamps: true }
);

export const Booking = model<TBooking & Document>("Booking", bookingSchema);
