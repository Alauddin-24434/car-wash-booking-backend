import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import { formatMinutesToTime, parseTimeToMinutes } from "./slot.utils";

const createSlotServicesIntoDB = async (payload: TSlot, duration: number) => {
  const { service, date, startTime, endTime } = payload;

  const slotsArry: TSlot[] = [];

  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  for (let time = startMinutes; time < endMinutes; time += duration) {
    const slot: TSlot = {
      service,
      date,
      startTime: formatMinutesToTime(time),
      endTime: formatMinutesToTime(time + duration),
      isBooked: "available",
    };
    const createSlot = await Slot.create(slot);
    slotsArry.push(createSlot);
  }

  return slotsArry;
};

//  Get available slots

export const getAvilabeSlotIntoDB = async (serviceId: string, date: string) => {

  console.log(serviceId,date)
  
  
 
  // Find slots in the database by service ID and date, and populate the service field with service details
  const slots = await Slot.find({  date ,service: serviceId}).populate(
    "service",
  );
  //  console.log(slots)
  if (!slots || slots.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Slots not found!");
  }

  return slots;
};

const getAllSlotsIntoDB = async () => {
  // date 2024-09-01
  const services = await Slot.find({ isDeleted: { $ne: true } }).populate("service",);
  return services;
};
const toggleSlotStatusInDB = async (slotId: string) => {
  const slot = await Slot.findById(slotId);

  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found!");
  }

  if (slot.isBooked === "booked") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot update the status of a booked slot.");
  }

  // Toggle the status between available and canceled
  slot.isBooked = slot.isBooked === "available" ? "canceled" : "available";
  await slot.save();

  return slot;
};



export const services = {
  createSlotServicesIntoDB,
  getAvilabeSlotIntoDB,
  getAllSlotsIntoDB,
  toggleSlotStatusInDB 
};
