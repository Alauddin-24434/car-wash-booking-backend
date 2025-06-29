// src/controllers/booking.controller.ts

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { Booking } from "./booking.model";
import { bookingService } from "./booking.services";

// POST /api/bookings
// controller/booking.controller.ts


const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.createBooking(req.body); // transaction ও payment সহ
   const {paymentResult}=result;
  if (req.body.paymentMethod === "aamarpay") {
    return res.status(200).json({
      success: true,
      message: result.message,
      booking: result.booking,
      paymentUrl:paymentResult.payment_url, // তুমি যেটা পাবে AamarPay থেকে
    });
  } else if (req.body.paymentMethod === "bkash") {
    return res.status(200).json({
      success: true,
      message: result.message,
      booking: result.booking,
      bkashRedirectUrl:paymentResult.bkash_url, // যদি bkash হয়
    });
  } else {
    return res.status(200).json({
      success: true,
      message: result.message,
      booking: result.booking,
    });
  }
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