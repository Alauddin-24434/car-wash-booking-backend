import express from "express";
import { BookingControllers } from "./booking.controler";


const router = express.Router();

router.post(
  "/bookings",
 
  // validateRequest(bookingzodValiditions.zodbookingSchema),
  BookingControllers.createBooking,
);

// get all booking
router.get(
  "/bookings",

  BookingControllers.getAllBooking,
);
router.get(
  "/my-bookings/:id",

  BookingControllers.getMyBookings,
);

export const BookingRoutes = router;
