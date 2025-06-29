import express from "express";
import { bookingController,   } from "./booking.controler";

const router = express.Router();

router.post("/bookings", bookingController.createBooking);

// get all booking
router.get("/bookings", bookingController.getAllBookings);
router.get("/bookings/:id",bookingController.getBookingById);

export const BookingRoutes = router;
