import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { ISlot, ISlotQueryParams } from "./slot.interface";
import { Slot } from "./slot.model";
import type { SortOrder } from "mongoose";
import { formatMinutesToTime, parseTimeToMinutes } from "./slot.utils";


const createSlotsIntoDB = async (payload: ISlot) => {
  const { serviceId, date, startTime, endTime, duration } = payload;

  const slotsArry: ISlot[] = [];

  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  for (let time = startMinutes; time < endMinutes; time += duration) {
    const slot: ISlot = {
      serviceId,
      date,
      startTime: formatMinutesToTime(time),
      endTime: formatMinutesToTime(time + duration),
      duration,
      status: "available",
    };

    const createSlot = await Slot.create(slot);
    slotsArry.push(createSlot);
  }

  return slotsArry;
};


// Get slots with optional filters (date, serviceId, availability)
const getSlotsFromDB = async (params: ISlotQueryParams) => {
  const {
    date,
    serviceId,
    status,
    limit = 10,
    page = 1,
    sort = "date",
  } = params;
  const skip = (page - 1) * limit;
  const filters: any = {};

  if (date) filters.date = date;
  if (serviceId) filters.serviceId = serviceId;
  if (status) filters.status = status;



  // Sort options fix for TypeScript
  const sortOptions: { [key: string]: SortOrder } = sort === "date"
    ? { date: 1, startTime: 1 }
    : { [sort]: 1 };

  const slots = await Slot.find(filters).sort(sortOptions).skip(skip).limit(limit);
  const total = await Slot.countDocuments(filters);

  return { slots, meta: { total, page, limit } };
};

// Find single slot by ID
const findSingleSlot = async (id: string) => {
  const slot = await Slot.findById(id);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
  }
  return slot;
};

// Update slot by ID
const updateSlotIntoDB = async (id: string, payload: Partial<ISlot>) => {
  const slot = await Slot.findById(id);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found!");
  }
  const updatedSlot = await Slot.findByIdAndUpdate(id, payload, { new: true });
  if (!updatedSlot) {
    throw new AppError(httpStatus.NOT_MODIFIED, "Slot update failed!");
  }
  return updatedSlot;
};

// Delete slot by ID (hard delete)
const deleteSlotIntoDB = async (id: string) => {
  const slot = await Slot.findByIdAndDelete(id);
  if (!slot) throw new AppError(httpStatus.NOT_FOUND, "Slot not found!");
  return slot;
};

export const slotService = {
  createSlotsIntoDB,
  getSlotsFromDB,
  findSingleSlot,
  updateSlotIntoDB,
  deleteSlotIntoDB,
};



