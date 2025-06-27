import axios from "axios";

import { bookingService } from "../Booking/booking.services";
import { TPaymentData } from "./payment.interface";

const isSandbox = process.env.AAMARPAY_SANDBOX_MODE === "true";
const aamarPayUrl = isSandbox
  ? "https://sandbox.aamarpay.com/jsonpost.php"
  : "https://secure.aamarpay.com/jsonpost.php";

// Initiate Payment with AamarPay
export const initiatePayment = async (data: TPaymentData) => {
  const postData = {
    store_id: process.env.AAMARPAY_STORE_ID,
    signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
    tran_id: data.transactionId,
    success_url: process.env.AAMARPAY_SUCCESS_URL,
    fail_url: process.env.AAMARPAY_FAIL_URL,
    cancel_url: process.env.AAMARPAY_CANCEL_URL,
    amount: data.amount,
    currency: "BDT",
    desc: "Booking Payment",
    cus_name: data.name,
    cus_email: data.email,
    cus_add1: data.address,
    cus_phone: data.phone,
    type: "json",
    opt_a: data.bookingId, // Pass booking ID for later reference
  };

  const response = await axios.post(aamarPayUrl, postData, {
    headers: { "Content-Type": "application/json" },
  });

  if (response.data?.payment_url) {
    return {
      success: true,
      paymentUrl: response.data.payment_url,
      message: "Redirect to AamarPay",
    };
  }

  return { success: false, message: "Payment initialization failed" };
};

// Handle success callback
export const handlePaymentSuccess = async (reqBody: any) => {
  const { opt_a: bookingId, tran_id: transactionId } = reqBody;

  if (!bookingId || !transactionId) {
    return { success: false, message: "Invalid success data" };
  }

  await bookingService.updateBookingStatus(bookingId, "paid");

  return {
    success: true,
    message: "Payment successful",
    bookingId,
    transactionId,
  };
};

// Handle fail or cancel
export const handlePaymentFailOrCancel = async (
  reqBody: any,
  status: "failed" | "cancelled"
) => {
  const { opt_a: bookingId } = reqBody;
  const bookingStatus: "pending" | "paid" | "cancelled" =
    status === "failed" ? "cancelled" : status;

  if (bookingId) {
    await bookingService.updateBookingStatus(bookingId, bookingStatus);
  }

  return {
    success: true,
    message: `Payment ${status}`,
  };
};
