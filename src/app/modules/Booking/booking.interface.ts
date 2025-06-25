import { Types } from "mongoose";

export interface IBooking {

  userId: Types.ObjectId | string;
  serviceId: Types.ObjectId | string;
  slotId: Types.ObjectId | string;

  amount: number;
  status: "pending" | "paid" | "cancelled";

  paymentMethod?: "cash" | "card" | "bkash" | "nagad" | "rocket" | "aamarpay";

  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
