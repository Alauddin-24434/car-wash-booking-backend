import { Booking } from "./booking.model";
import { IBooking } from "./booking.interface";
import mongoose, { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { initiatePayment } from "../../utils/aamarpay.payment";
import { Payment } from "../payment/payment.model";



const createBooking = async (payload: IBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customTransactionId = uuidv4();
    const bookData = {
      ...payload,
      transactionId: customTransactionId,
    };

    const booking = await Booking.create([bookData], { session });

    const paymentInitiateData = {
      transactionId: customTransactionId,
      bookingId: booking[0]._id.toString(),
      amount: booking[0].amount,
      name: booking[0].name,
      email: booking[0].email,
      phone: booking[0].phone,
      paymentStatus: "initiated" as "initiated",
    };

    const paymentResult = await initiatePayment(paymentInitiateData);


    // ✅ শুধু error throw করো
    if (!paymentResult?.payment_url) {
      throw new Error("Payment initiation failed");
    }


    const paymentData = {
      transactionId: customTransactionId,
      bookingId: booking[0]._id.toString(),
      amount: booking[0].amount,
      name: booking[0].name,
      email: booking[0].email,
      phone: booking[0].phone,
      paymentStatus: "initiated" as "initiated",
    };

    await Payment.create([paymentData], { session });


    await session.commitTransaction();
    return {
      success: true,
      message: "Booking and payment initiated successfully",
      booking: booking[0],
      paymentResult,
    };
  } catch (error: any) {

    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}



const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("userId", "name email")
    .populate("serviceId", "name price")
    .populate("slotId");
  return bookings;
};

const getBookingById = async (id: string | Types.ObjectId) => {
  const booking = await Booking.findById(id)
    .populate("userId", "name email")
    .populate("serviceId", "name price")
    .populate("slotId");

  return booking;
};

const updateBookingStatus = async (id: string, status: IBooking["status"]) => {
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  return booking;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
};
