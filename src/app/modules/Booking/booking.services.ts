import { Booking } from "./booking.model";
import { IBooking } from "./booking.interface";
import { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const createBooking = async (payload: IBooking) => {
  const customTransactionId = uuidv4(); // ✅ Custom Unique ID
  const bookData = {
    ...payload,
    transactionId: customTransactionId,
  }
  const booking = await Booking.create(bookData);

  // ২. পেমেন্ট ইনিশিয়েট করো (AamarPay এর জন্য)
  const paymentResult = await initiatePayment({
    transactionId: booking.transactionId!,
    bookingId: booking._id.toString(),
    amount: booking.amount,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    address: "", // প্রয়োজনে address পাঠাও
    paymentStatus: "initiated",
  });

  if (!paymentResult.success) {
    return res.status(500).json({ success: false, message: "Payment initiation failed" });
  }



};

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
