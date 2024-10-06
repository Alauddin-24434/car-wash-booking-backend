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
exports.orderService = void 0;
const service_model_1 = require("../service/service.model");
const order_model_1 = __importDefault(require("./order.model"));
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, bookingService, } = orderData;
    let totalPrice = 0;
    // Calculate the total price
    const bookingDetails = yield Promise.all(bookingService.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const service = yield service_model_1.Service.findById(item.serviceId);
        console.log("service", service);
        if (service) {
            totalPrice += service.price;
            return {
                service: service._id,
            };
        }
        else {
            throw new Error('Service not found');
        }
    })));
    console.log(bookingDetails);
    const transactionId = `TXN-${Date.now()}`;
    const order = new order_model_1.default({
        name,
        products: bookingDetails,
        totalPrice,
        status: 'Pending',
        paymentStatus: 'Pending',
        transactionId
    });
    yield order.save();
    return order;
});
exports.orderService = {
    createOrder
};
