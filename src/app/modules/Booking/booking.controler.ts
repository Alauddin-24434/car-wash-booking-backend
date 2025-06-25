// src/controllers/booking.controller.ts

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { Booking } from "./booking.model";

// POST /api/bookings
export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

// GET /api/bookings
export const getAllBookings = catchAsync(async (_req: Request, res: Response) => {
  const bookings = await Booking.find()
    .populate("userId", "name email")
    .populate("serviceId", "name price")
    .populate("slotId");

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

// GET /api/bookings/:id
export const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email")
    .populate("serviceId", "name")
    .populate("slotId");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});


export const bookingController={
  createBooking,
  getAllBookings,
  getBookingById
}