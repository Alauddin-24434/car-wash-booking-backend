export type TBooking = {
  
  name:string;
  email:string;
  serviceId: object;
  slotId: object;
  status: 'upcoming' | 'past';
  createdAt?: Date;
  updatedAt?: Date;
};
