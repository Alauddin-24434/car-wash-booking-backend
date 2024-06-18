"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    serviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Service",
        required: [true, "Service ID is required"],
    },
    slotId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
