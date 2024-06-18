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
exports.services = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const service_model_1 = require("./service.model");
// Helper function to find a service by ID and check if it exists and is not soft-deleted
const findService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(id);
    if (!service || service.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service not found!");
    }
    return service;
});
// Create a new service in the database
const createServiceServicesIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.create(payload);
    return service;
});
// Get all services from the database
const getAllServicesIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield service_model_1.Service.find({ isDeleted: { $ne: true } });
    return services;
});
// Get a single service by ID from the database
const getSingleServiceIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return findService(id);
});
// Update a service by ID in the database
const updateServicesIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield findService(id); // Ensure the service exists before updating
    const updatedService = yield service_model_1.Service.updateOne({ _id: id }, payload);
    if (updatedService.modifiedCount) {
        return findService(id); // Return the updated service
    }
    throw new AppError_1.default(http_status_1.default.NOT_MODIFIED, "Service update failed!");
});
// Soft delete a service by ID in the database
const deletedServicesIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield findService(id);
    yield service_model_1.Service.updateOne({ _id: id }, { isDeleted: true });
    const result = yield service_model_1.Service.findById(id);
    return result;
});
// Export all service functions
exports.services = {
    createServiceServicesIntoDB,
    getAllServicesIntoDB,
    getSingleServiceIntoDB,
    updateServicesIntoDB,
    deletedServicesIntoDB,
};
