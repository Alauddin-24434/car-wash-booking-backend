"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controler_1 = require("./booking.controler");
const router = express_1.default.Router();
router.post("/bookings", 
// validateRequest(bookingzodValiditions.zodbookingSchema),
booking_controler_1.BookingControllers.createBooking);
// get all booking
router.get("/bookings", booking_controler_1.BookingControllers.getAllBooking);
router.get("/my-bookings/:id", booking_controler_1.BookingControllers.getMyBookings);
exports.BookingRoutes = router;
