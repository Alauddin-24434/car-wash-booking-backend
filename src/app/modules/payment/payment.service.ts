import mongoose from "mongoose";
import { Booking } from "../Booking/booking.model";
import { Payment } from "./payment.model";
import { initiatePayment, verifyPaymentWithAmarPay } from "./payment.utils";

export const createPayment = async (bookingId: string) => {
  // Find the booking by ID
  const findBooking = await Booking.findById(bookingId);
  if (!findBooking) {
    throw new Error("Booking not found");
  }

  // Extract booking details
  const { name, email, phone, address, totalPrice: amount ,paymentStatus} = findBooking;

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
  console.log(paymentResponse);
  // Save the payment details in the Payment model
  const newPayment = new Payment({
    transactionId,
    bookingId,
    amount,
    name,
    email,
    phone,
    address,
    paymentStatus,
  });

  await newPayment.save();

  return paymentResponse;
};


export const verifyAndUpdatePaymentStatus = async (transactionId: string) => {
  const session = await mongoose.startSession();
  try {
      session.startTransaction();

      // Step 1: Verify payment with AmarPay (or another payment gateway)
      const verificationResponse = await verifyPaymentWithAmarPay(transactionId);
      console.log('AmarPay verification response:', verificationResponse);

      // Step 2: Find the payment in the database
      const payment = await Payment.findOne({ transactionId }).session(session);
      if (!payment) {
          console.log('Payment not found');
          throw new Error('Payment not found');
      }

      // Step 3: Check the verification response and update the payment status
      if (verificationResponse && verificationResponse.pay_status === 'Successful') {
          payment.paymentStatus = 'successful';
          console.log('Payment status set to successful');

          // Update the booking's payment status to "paid"
          await Booking.findByIdAndUpdate(
              payment.bookingId,
              { paymentStatus: 'paid', transactionId },
              { session }
          );
          console.log('Booking payment status updated to paid');
      } else {
          payment.paymentStatus = 'failed';
          console.log('Payment status set to failed');
      }

      // Step 4: Save the updated payment status in the database
      await payment.save({ session });
      console.log('Updated payment saved:', payment);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return payment;
  } catch (error) {
      // Abort the transaction if an error occurred
      await session.abortTransaction();
      session.endSession();
      throw error;
  }
};
