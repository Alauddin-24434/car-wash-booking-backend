import mongoose from "mongoose";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Slot } from "../slot/slot.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { User } from "../user/user.model";

const createBookingServicesIntoDB = async (
  payload: TBooking,
  token: string
) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { userId,  } = decoded;
    const findUser = await User.findById(userId);
    // Create the booking with the provided payload
    const [newBooking] = await Booking.create([payload], { session });

    // Update the slot to set isBooked to "booked"
    const updatedSlot = await Slot.findByIdAndUpdate(
      payload.slotId,
      { isBooked: "booked" },
      { new: true, session }
    );

    if (!updatedSlot) {
      throw new AppError(httpStatus.BAD_REQUEST, "Slot not found");
    }

    // Populate the related fields
    const populatedBooking = await (await newBooking.populate("serviceId")).populate("slotId");

    // Destructure the populated fields
    const {
      _id,
      serviceId,
      slotId,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      manufacturingYear,
      registrationPlate,
      createdAt,
      updatedAt,
    } = populatedBooking;

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Construct the response data
    return {
      success: true,
      statusCode: 200,
      message: "Booking created successfully",
      data: {
        _id,
        customer: findUser,
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
  } catch (error) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllBookingIntoDB = async () => {
  // Fetch all bookings and populate related fields

  const bookings = await Booking.find()
    .populate("customer")
    .populate("serviceId")
    .populate("slotId");

  // Map each booking to extract necessary data
  const formattedBookings = bookings.map((booking) => ({
    _id: booking._id,
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
};

const getBookingsByUserId = async (userId: string) => {
  try {
    // Example query to fetch bookings associated with a user
    const userBookings = await Booking.find({ user: userId })
      .populate("service")
      .populate("slot");

    return userBookings;
  } catch (error) {
    throw new AppError( httpStatus.BAD_REQUEST,`Failed to fetch bookings for user `
    );
  }
};

export const services = {
  createBookingServicesIntoDB,
  getAllBookingIntoDB,
  getBookingsByUserId,
};
