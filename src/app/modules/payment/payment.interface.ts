export type TPaymentData = {
  transactionId: string;
  bookingId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
  paymentStatus: "initiated" | "success" | "failed" | "cancelled";
};
