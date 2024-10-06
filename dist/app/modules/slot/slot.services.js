"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = exports.getAvilabeSlotIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const slot_model_1 = require("./slot.model");
const slot_utils_1 = require("./slot.utils");
const createSlotServicesIntoDB = (payload, duration) => __awaiter(void 0, void 0, void 0, function* () {
    const { service, date, startTime, endTime } = payload;
    const slotsArry = [];
    const startMinutes = (0, slot_utils_1.parseTimeToMinutes)(startTime);
    const endMinutes = (0, slot_utils_1.parseTimeToMinutes)(endTime);
    for (let time = startMinutes; time < endMinutes; time += duration) {
        const slot = {
            service,
            date,
            startTime: (0, slot_utils_1.formatMinutesToTime)(time),
            endTime: (0, slot_utils_1.formatMinutesToTime)(time + duration),
            isBooked: "available",
        };
        const createSlot = yield slot_model_1.Slot.create(slot);
        slotsArry.push(createSlot);
    }
    return slotsArry;
});
//  Get available slots
const getAvilabeSlotIntoDB = (serviceId, date) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(serviceId, date);
    // Find slots in the database by service ID and date, and populate the service field with service details
    const slots = yield slot_model_1.Slot.find({ date, service: serviceId }).populate("service");
    //  console.log(slots)
    if (!slots || slots.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Slots not found!");
    }
    return slots;
});
exports.getAvilabeSlotIntoDB = getAvilabeSlotIntoDB;
const getAllSlotsIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // date 2024-09-01
    const services = yield slot_model_1.Slot.find({ isDeleted: { $ne: true } }).populate("service");
    return services;
});
const toggleSlotStatusInDB = (slotId) => __awaiter(void 0, void 0, void 0, function* () {
    const slot = yield slot_model_1.Slot.findById(slotId);
    if (!slot) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Slot not found!");
    }
    if (slot.isBooked === "booked") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot update the status of a booked slot.");
    }
    // Toggle the status between available and canceled
    slot.isBooked = slot.isBooked === "available" ? "canceled" : "available";
    yield slot.save();
    return slot;
});
exports.services = {
    createSlotServicesIntoDB,
    getAvilabeSlotIntoDB: exports.getAvilabeSlotIntoDB,
    getAllSlotsIntoDB,
    toggleSlotStatusInDB
};
