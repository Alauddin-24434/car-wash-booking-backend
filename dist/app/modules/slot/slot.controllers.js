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
exports.slotControllers = exports.getAvailableSlots = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const slot_services_1 = require("./slot.services");
// Create service
const createSlot = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const duration = 60; // Assume 60 minutes for the example
    const serviceData = req.body;
    const result = yield slot_services_1.services.createSlotServicesIntoDB(serviceData, duration);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Slot created successfully",
        data: result,
    });
}));
exports.getAvailableSlots = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, serviceId } = req.query;
    // if (!date || !serviceId) {
    //   res
    //     .status(400)
    //     .json({ success: false, message: "Date and serviceId are required" });
    //   return;
    // }
    const slots = yield slot_services_1.services.getAvilabeSlotIntoDB(serviceId, date);
    //  console.log(slots)
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Available slots retrieved successfully",
        data: slots,
    });
}));
exports.slotControllers = {
    createSlot,
    getAvailableSlots: exports.getAvailableSlots,
};
