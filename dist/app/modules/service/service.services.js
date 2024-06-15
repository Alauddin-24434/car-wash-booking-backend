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
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const service_model_1 = require("./service.model");
const createServiceServicesIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.create(payload);
    return service;
});
// get all services 
const getAllServicesIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield service_model_1.Service.find();
    return services;
});
//  get service find by Id
const getSingleServiceIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findService = yield service_model_1.Service.findById(id);
    return findService;
});
const updateServicesIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedService = yield service_model_1.Service.updateOne({ _id: id }, payload);
    if (updatedService.modifiedCount) {
        const data = yield service_model_1.Service.findById(id);
        return data;
    }
});
// Soft delete service by ID
const deletedServicesIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const softDeleted = yield service_model_1.Service.updateOne({ _id: id }, { isDeleted: true });
    return softDeleted;
});
exports.services = {
    createServiceServicesIntoDB,
    updateServicesIntoDB,
    deletedServicesIntoDB,
    getSingleServiceIntoDB,
    getAllServicesIntoDB
};
