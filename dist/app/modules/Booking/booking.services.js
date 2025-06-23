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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const user_model_1 = require("../user/user.model");
const service_model_1 = require("../service/service.model");
const payment_utils_1 = require("../payment/payment.utils");
const payment_model_1 = require("../payment/payment.model");
const createBookingServicesIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { userId, bookingService: bookingServiceMap } = payload;
        // Find user by ID
        const findUserById = yield user_model_1.User.findById(userId).session(session);
        if (!findUserById) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `User with ID ${userId} not found`);
        }
        const _a = findUserById.toObject(), { isDeleted, role } = _a, userData = __rest(_a, ["isDeleted", "role"]);
        let totalPrice = 0;
        // Extract slot IDs from bookingServiceMap
        const slotIds = bookingServiceMap.map((item) => item.slotId);
        // Find all slots by their IDs
        const slots = yield slot_model_1.Slot.find({ _id: { $in: slotIds } }).session(session);
        // Create a map for slotId to slot object
        const slotMap = new Map(slots.map((slot) => [slot._id.toString(), slot]));
        // Collect error messages for slots
        const errorSlots = [];
        // Check for slot conflicts
        bookingServiceMap.forEach((item) => {
            const { slotId, startTime } = item;
            const slot = slotMap.get(slotId.toString());
            if (!slot) {
                // If slot not found, it's an error
                errorSlots.push(`Slot with ID ${slotId} not found.`);
                return;
            }
            // Check if the slot is already booked or processing
            if (slot.isBooked === "booked" ||
                slot.isBooked === "processing" ||
                slot.isBooked === "canceled") {
                errorSlots.push(`Slot with start time ${startTime} is already booked or in process.`);
            }
        });
        // If there are slot conflicts, throw an error
        if (errorSlots.length > 0) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, errorSlots.join(" "));
        }
        // Process each booking service
        const bookingService = yield Promise.all(bookingServiceMap.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const { serviceId, slotId, status } = item;
            const service = yield service_model_1.Service.findById(serviceId).session(session);
            if (!service) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Service with ID ${serviceId} not found`);
            }
            // Find the slot by ID from the map
            const slot = slotMap.get(slotId.toString());
            if (!slot) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Slot with ID ${slotId} not found`);
            }
            // Add the service price to the total price
            totalPrice += service.price;
            // Update the slot status to "PROCESSING"
            slot.isBooked = "booked";
            yield slot.save({ session });
            // Return processed service data
            return {
                serviceId: service._id,
                serviceName: service.name,
                slotId: slot._id,
                status,
                price: service.price,
                startTime: slot.startTime,
                endTime: slot.endTime,
                date: slot.date,
            };
        })));
        const bookingData = {
            userId: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            totalPrice,
            bookingService,
        };
        // Create a new booking document
        const [newBooking] = yield booking_model_1.Booking.create([bookingData], { session });
        console.log("New booking:", newBooking);
        // Extract booking details
        const { _id, name, email, phone, address, totalPrice: amount, paymentStatus, } = newBooking;
        // Generate a unique transaction ID
        const transactionId = `TXN-${Date.now()}`;
        // Call the payment gateway's initiatePayment function
        const paymentResponse = yield (0, payment_utils_1.initiatePayment)(transactionId, name, email, phone, address, amount);
        if (!paymentResponse) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Payment initiation failed");
        }
        // Save the payment details in the Payment model
        const newPayment = new payment_model_1.Payment({
            transactionId,
            bookingId: _id,
            amount,
            name,
            email,
            phone,
            address,
            paymentStatus,
        });
        yield newPayment.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return paymentResponse;
    }
    catch (error) {
        // Abort the transaction if an error occurred
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllBookingIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield booking_model_1.Booking.find()
        .populate("serviceId")
        .populate("slotId");
    const formattedBookings = bookings.map((booking) => ({
        _id: booking._id,
    }));
    return formattedBookings;
});
const getBookingsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query to find bookings for the specified user with successful payment status
        const userBookings = yield booking_model_1.Booking.find({
            userId: userId,
            paymentStatus: "paid",
        })
            .populate({
            path: "bookingService.serviceId",
            select: "name image duration price",
        })
            .populate({
            path: "bookingService.slotId",
            select: "date startTime endTime",
        });
        if (!userBookings) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Your bookings are empty");
        }
        return userBookings;
    }
    catch (error) {
        // console.error("Error fetching bookings:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Unable to fetch bookings");
    }
});
exports.services = {
    createBookingServicesIntoDB,
    getAllBookingIntoDB,
    getBookingsByUserId,
};
