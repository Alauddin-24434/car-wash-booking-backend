import express from "express";
import { BookingControllers } from "./booking.controler";
import authValidation from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateTequest";
import { bookingzodValiditions } from "./booking.zodValidation";

const router = express.Router();

router.post(
  "/bookings",
  authValidation("user"),
  // validateRequest(bookingzodValiditions.zodbookingSchema),
  BookingControllers.createBooking,
);

// get all booking
router.get(
  "/bookings",
  authValidation("admin"),
  BookingControllers.getAllBooking,
);
router.get(
  "/my-bookings/:id",
  authValidation("user"),
  BookingControllers.getMyBookings,
);

export const BookingRoutes = router;
