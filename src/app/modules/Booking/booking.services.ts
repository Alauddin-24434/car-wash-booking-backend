import mongoose from "mongoose";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Slot } from "../slot/slot.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const createBookingServicesIntoDB = async (
  payload: TBooking,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { slotId: id } = payload;

    // Check if the slot is available
    const slot = await Slot.findById(id).session(session);

    if (!slot) {
      throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
    }

    if (slot.isBooked === "booked") {
      throw new AppError(httpStatus.BAD_REQUEST, "Slot is already booked");
    }

    const bookingPayload = {
      ...payload,
    };

    const [newBooking] = await Booking.create([bookingPayload], { session });

    // Update the slot to set isBooked to "booked"
    const updatedSlot = await Slot.findByIdAndUpdate(
      payload.slotId,
      { isBooked: "booked" },
      { new: true, session },
    );

    if (!updatedSlot) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slot not found");
    }

    // Populate the related fields
    const populatedBooking = await (
      await newBooking.populate("serviceId")
    ).populate("slotId");

    const {
      _id,
      serviceId,
      slotId,
      createdAt,
      updatedAt,
    } = populatedBooking;

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      statusCode: 200,
      message: "Booking created successfully",
      data: {
        _id,
        service: serviceId,
        slot: slotId,
        createdAt,
        updatedAt,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllBookingIntoDB = async () => {
  const bookings = await Booking.find()
    .populate("serviceId")
    .populate("slotId");

  const formattedBookings = bookings.map((booking) => ({
    _id: booking._id,
    service: booking.serviceId,
    slot: booking.slotId,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }));

  return formattedBookings;
};

const getBookingsByUserId = async (token: string) => {
  // Assuming the token is valid and contains a user ID
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  const { userId } = decoded;

  const userBookings = await Booking.find({ userId })
    .populate("serviceId")
    .populate("slotId");

  return userBookings;
};

export const services = {
  createBookingServicesIntoDB,
  getAllBookingIntoDB,
  getBookingsByUserId,
};
