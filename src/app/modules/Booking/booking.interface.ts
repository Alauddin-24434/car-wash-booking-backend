export type TBookingService = {
  serviceId: object;
  serviceName: string;
  slotId: object;
  status: "upcoming" | "past";
  date: string;
  startTime: string;
  endTime: string;
};
export type TBookingUser = {

};

export type TBooking = {
  userId:string;
  name: string;
  email: string;
  phone: string;
  status:"past" | "upcoming";
  address: string;
  paymentStatus:"pending"| "successful" | "paid" |"failed";
  user: TBookingUser;
  bookingService: TBookingService[];
  totalPrice: number;
  isDeleted: boolean;
};
