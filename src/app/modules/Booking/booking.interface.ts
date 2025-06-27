import { Types } from "mongoose";

export interface IBookingServiceEntry {
  serviceId: Types.ObjectId | string;
  slotIds: (Types.ObjectId | string)[];
}

export interface IBooking {
  userId: Types.ObjectId | string;
  services: IBookingServiceEntry[];

  amount: number;
  status: "pending" | "paid" | "cancelled";

  paymentMethod?: "cash" | "card" | "bkash" | "nagad" | "rocket" | "aamarpay";
  transactionId?: string;


  notifications: boolean;
  name: string;
  email: string;
  phone: string;

  createdAt?: Date;
  updatedAt?: Date;
}
