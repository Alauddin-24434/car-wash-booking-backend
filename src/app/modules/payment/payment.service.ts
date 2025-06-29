import axios from "axios";

import { bookingService } from "../booking/booking.services";
import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";
import mongoose from "mongoose";
import { verifyPaymentWithAmarPay } from "../../utils/aamarpay.payment";


export const handlePaymentSuccess = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Step 1: Verify with AamarPay
    const verificationResponse = await verifyPaymentWithAmarPay(transactionId);
    console.log('AamarPay verification response:', verificationResponse);

    // ✅ Step 2: Get payment record
    const payment = await Payment.findOne({ transactionId }).session(session);
    if (!payment) throw new Error('Payment not found');

    // ✅ Step 3: Update status based on AamarPay response
    if (
      verificationResponse &&
      verificationResponse.pay_status === "Successful"
    ) {
      payment.paymentStatus ="success" ;

      // ✅ Also update booking as booked
      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { status: "paid" },
        { session }
      );
    } else {
      payment.paymentStatus = "failed";
    }

    // ✅ Step 4: Save changes
    await payment.save({ session });
    await session.commitTransaction();
    session.endSession();

    return {
      status: payment.paymentStatus,
      pay_status: verificationResponse.pay_status,
      status_title: verificationResponse.status_title,
      payment_type: verificationResponse.payment_type,
      amount: verificationResponse.amount,

      transactionId,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const handlePaymentFailOrCancel = async (
  transactionId: string,
  status: "failed" | "cancelled" = "failed"
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Step 1: Find payment by transactionId
    const payment = await Payment.findOne({ transactionId }).session(session);
    if (!payment) throw new Error("Payment not found");

    // ✅ Step 2: Update payment status
    payment.paymentStatus = status;
    await payment.save({ session });

    // ✅ Optional: Update booking status as 'cancelled' if needed
    await Booking.findByIdAndUpdate(
      payment.bookingId,
      { status: status },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      status: payment.paymentStatus,
      transactionId,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
