import mongoose from "mongoose";
import { TBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Slot } from "../slot/slot.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

import { User } from "../user/user.model";
import { TUser } from "../user/user.interface";
import { Service } from "../service/service.model";
import { initiatePayment } from "../payment/payment.utils";
import { Payment } from "../payment/payment.model";

const createBookingServicesIntoDB = async (payload: TBooking) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { userId, bookingService: bookingServiceMap } = payload;

    // Find user by ID
    const findUserById = await User.findById(userId).session(session);
    if (!findUserById) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `User with ID ${userId} not found`
      );
    }

    const { isDeleted, role, createdAt, updatedAt, __v, ...userData } =
      findUserById.toObject<TUser>();

    let totalPrice = 0;

    // Extract slot IDs from bookingServiceMap
    const slotIds = bookingServiceMap.map((item) => item.slotId);

    // Find all slots by their IDs
    const slots = await Slot.find({ _id: { $in: slotIds } }).session(session);

    // Create a map for slotId to slot object
    const slotMap = new Map(slots.map((slot) => [slot._id.toString(), slot]));

    // Collect error messages for slots
    const errorSlots: string[] = [];

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
      if (
        slot.isBooked === "booked" ||
        slot.isBooked === "processing" ||
        slot.isBooked === "canceled"
      ) {
        errorSlots.push(
          `Slot with start time ${startTime} is already booked or in process.`
        );
      }
    });

    // If there are slot conflicts, throw an error
    if (errorSlots.length > 0) {
      throw new AppError(httpStatus.BAD_REQUEST, errorSlots.join(" "));
    }

    // Process each booking service
    const bookingService = await Promise.all(
      bookingServiceMap.map(async (item) => {
        const { serviceId, slotId, status } = item;

        const service = await Service.findById(serviceId).session(session);
        if (!service) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Service with ID ${serviceId} not found`
          );
        }

        // Find the slot by ID from the map
        const slot = slotMap.get(slotId.toString());
        if (!slot) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Slot with ID ${slotId} not found`
          );
        }

        // Add the service price to the total price
        totalPrice += service.price;

        // Update the slot status to "PROCESSING"
        slot.isBooked = "booked";
        await slot.save({ session });

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
      })
    );

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
    const [newBooking] = await Booking.create([bookingData], { session });
    console.log("New booking:", newBooking);

    // Extract booking details
    const {
      _id,
      name,
      email,
      phone,
      address,
      totalPrice: amount,
      paymentStatus,
    } = newBooking;

    // Generate a unique transaction ID
    const transactionId = `TXN-${Date.now()}`;

    // Call the payment gateway's initiatePayment function
    const paymentResponse = await initiatePayment(
      transactionId,
      name,
      email,
      phone,
      address,
      amount
    );

    if (!paymentResponse) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Payment initiation failed"
      );
    }

    // Save the payment details in the Payment model
    const newPayment = new Payment({
      transactionId,
      bookingId: _id,
      amount,
      name,
      email,
      phone,
      address,
      paymentStatus,
    });

    await newPayment.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return paymentResponse;
  } catch (error) {
    // Abort the transaction if an error occurred
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
  }));

  return formattedBookings;
};

const getBookingsByUserId = async (userId: string) => {
  try {
    

    // Query to find bookings for the specified user with successful payment status
    const userBookings = await Booking.find({
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
      throw new AppError(httpStatus.NOT_FOUND, "Your bookings are empty");
    }

    return userBookings;
  } catch (error) {
    // console.error("Error fetching bookings:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Unable to fetch bookings");
  }
};

export const services = {
  createBookingServicesIntoDB,
  getAllBookingIntoDB,
  getBookingsByUserId,
};
