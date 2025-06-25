import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { ISlot, ISlotQueryParams } from "./slot.interface";
import { Types } from "mongoose";
import { Slot } from "./slot.model";
import type { SortOrder } from "mongoose";

// Create slot(s), recurring logic included
const createSlotsIntoDB = async (payload: ISlot & { repeatDays?: number; blockedDates?: string[] }) => {
  const {
    date,
    startTime,
    endTime,
    duration,
    capacity,
    
    serviceId,
    recurring = false,
    repeatDays = 0,
    blockedDates = [],
  } = payload;

  // Friday (day 5) and blockedDates skip করব
  const isDateBlocked = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDay() === 5 || blockedDates.includes(dateStr);
  };

  const slotsToCreate: ISlot[] = [];

  if (recurring && repeatDays > 0) {
    const startDate = new Date(date);
    for (let i = 0; i < repeatDays; i++) {
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + i);
      const nextDateStr = nextDate.toISOString().split("T")[0];
      if (isDateBlocked(nextDateStr)) continue;

      slotsToCreate.push({
        date: nextDateStr,
        startTime,
        endTime,
        duration,
        capacity,
        booked: 0,
        available: capacity,
        status: "available",
        serviceId: new Types.ObjectId(serviceId),
        recurring,
        blockedDates,
      });
    }
  } else {
    if (!isDateBlocked(date)) {
      slotsToCreate.push({
        date,
        startTime,
        endTime,
        duration,
        capacity,
        booked: 0,
        available: capacity,
        status: "available",
    
        serviceId: new Types.ObjectId(serviceId),
        recurring,
        blockedDates,
      });
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Slot date is blocked or on Friday");
    }
  }

  const createdSlots = await Slot.insertMany(slotsToCreate);
  return createdSlots;
};

// Get slots with optional filters (date, serviceId, availability)
const getSlotsFromDB = async (params: ISlotQueryParams) => {
  const {
    date,
    serviceId,
    status,
    availability,
    limit = 10,
    page = 1,
    sort = "date",
  } = params;
  const skip = (page - 1) * limit;
  const filters: any = {};

  if (date) filters.date = date;
  if (serviceId) filters.serviceId = serviceId;
  if (status) filters.status = status;

  if (availability !== undefined) {
    filters.available = availability ? { $gt: 0 } : { $eq: 0 };
  }

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
