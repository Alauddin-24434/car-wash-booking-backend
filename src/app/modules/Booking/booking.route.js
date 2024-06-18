"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controler_1 = require("./booking.controler");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateTequest_1 = __importDefault(require("../../middlewares/validateTequest"));
const booking_zodValidation_1 = require("./booking.zodValidation");
const router = express_1.default.Router();
router.post("/bookings", (0, auth_1.default)("user"), (0, validateTequest_1.default)(booking_zodValidation_1.bookingzodValiditions.zodbookingSchema), booking_controler_1.BookingControllers.createBooking);
// get all booking
router.get("/bookings", (0, auth_1.default)("admin"), booking_controler_1.BookingControllers.getAllBooking);
router.get("/my-bookings", (0, auth_1.default)("user"), booking_controler_1.BookingControllers.getMyBookings);
exports.BookingRoutes = router;
