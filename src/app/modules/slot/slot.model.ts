import { Schema, model, Types } from "mongoose";
import { ISlot } from "./slot.interface";

const slotSchema = new Schema({
  date: {
    type: String,
    required: true, // ISO date string, e.g. "2025-06-25"
  },
  startTime: {
    type: String,
    required: true, // e.g. "10:00 AM"
  },
  endTime: {
    type: String,
    required: true, // e.g. "11:00 AM"
  },
  duration: {
    type: Number,
    required: true, // minutes
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  booked: {
    type: Number,
    default: 0,
    min: 0,
  },
  available: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["available", "full", "blocked"],
    default: "available",
  },

  serviceId: {
    type: Types.ObjectId,
    ref: "Service",
    required: true,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  repeatDays: {
    type: Number,
    default: 0,
  },
  blockedDates: {
    type: [String], // array of ISO date strings
    default: [],
  },
}, {
  timestamps: true,
});


export const Slot = model<ISlot>("Slot", slotSchema)
