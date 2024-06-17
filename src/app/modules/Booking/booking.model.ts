import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

const bookingSchema = new Schema<TBooking>(
  {
    customer: {
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
    vehicleType: {
      type: String,
      enum: {
        values: [
          "car",
          "truck",
          "SUV",
          "van",
          "motorcycle",
          "bus",
          "electricVehicle",
          "hybridVehicle",
          "bicycle",
          "tractor",
        ],
        message: "Vehicle type is not valid",
      },
      required: [true, "Vehicle type is required"],
    },
    vehicleBrand: {
      type: String,
      required: [true, "Vehicle brand is required"],
    },
    vehicleModel: {
      type: String,
      required: [true, "Vehicle model is required"],
    },
    manufacturingYear: {
      type: Number,
      required: [true, "Manufacturing year is required"],
    },
    registrationPlate: {
      type: String,
      required: [true, "Registration plate is required"],
    },
  },
  { timestamps: true }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
