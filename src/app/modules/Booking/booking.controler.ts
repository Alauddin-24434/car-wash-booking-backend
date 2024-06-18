import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { services } from "./booking.services";
import sendResponse from "../../utils/sendResponse";

const createBooking = catchAsync(async (req, res) => {
  const bookingData = req.body;
  const token= req.headers.authorization?.replace("Bearer ", "");

  const createdBooking = await services.createBookingServicesIntoDB(
    bookingData,
    token as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking successful",
    data: createdBooking,
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const findBooking = await services.getAllBookingIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings retrieved successfully",
    data: findBooking,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const userBookings = await services.getBookingsByUserId(token as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User bookings retrieved successfully",
    data: userBookings,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBooking,
  getMyBookings,
};
