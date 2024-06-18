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
exports.services = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("./booking.model");
const slot_model_1 = require("../slot/slot.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const createBookingServicesIntoDB = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // checking if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { userId } = decoded;
        const bookingPayload = Object.assign(Object.assign({}, payload), { customer: userId });
        // console.log(bookingPayload);
        // Create the booking with the provided payload
        const [newBooking] = yield booking_model_1.Booking.create([bookingPayload], { session });
        // Update the slot to set isBooked to "booked"
        const updatedSlot = yield slot_model_1.Slot.findByIdAndUpdate(payload.slotId, { isBooked: "booked" }, { new: true, session });
        if (!updatedSlot) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slot not found");
        }
        // Populate the related fields
        const populatedBooking = yield (yield (yield newBooking.populate("customer")).populate("serviceId")).populate("slotId");
        // Destructure the populated fields
        const { _id, customer, serviceId, slotId, vehicleType, vehicleBrand, vehicleModel, manufacturingYear, registrationPlate, createdAt, updatedAt, } = populatedBooking;
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        // Construct the response data
        return {
            success: true,
            statusCode: 200,
            message: "Booking created successfully",
            data: {
                _id,
                customer,
                service: serviceId,
                slot: slotId,
                vehicleType,
                vehicleBrand,
                vehicleModel,
                manufacturingYear,
                registrationPlate,
                createdAt,
                updatedAt,
            },
        };
    }
    catch (error) {
        // Rollback the transaction if any error occurs
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllBookingIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all bookings and populate related fields
    const bookings = yield booking_model_1.Booking.find()
        .populate("customer")
        .populate("serviceId")
        .populate("slotId");
    // Map each booking to extract necessary data
    const formattedBookings = bookings.map((booking) => ({
        _id: booking._id,
        customer: booking === null || booking === void 0 ? void 0 : booking.customer,
        service: booking.serviceId,
        slot: booking.slotId,
        vehicleType: booking.vehicleType,
        vehicleBrand: booking.vehicleBrand,
        vehicleModel: booking.vehicleModel,
        manufacturingYear: booking.manufacturingYear,
        registrationPlate: booking.registrationPlate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }));
    return formattedBookings;
});
const getBookingsByUserId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { userId } = decoded;
        // Query to fetch bookings associated with a user
        const userBookings = yield booking_model_1.Booking.find({ customer: userId })
            .populate("customer")
            .populate("serviceId")
            .populate("slotId");
        return userBookings;
    }
    catch (error) {
        // Log the error for debugging purposes
        // console.error('Error fetching bookings:', error);
        // Throw a new error with a message and status code
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to fetch bookings for user");
    }
});
exports.services = {
    createBookingServicesIntoDB,
    getAllBookingIntoDB,
    getBookingsByUserId,
};
