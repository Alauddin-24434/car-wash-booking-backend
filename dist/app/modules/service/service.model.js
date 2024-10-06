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
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const serviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
serviceSchema.pre("updateOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = this.getFilter();
        const service = yield exports.Service.findById(filter._id);
        if (!service) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Deleted id does not exist!");
        }
        next();
    });
});
// Soft delete filter when getting all services
// serviceSchema.pre('find', function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });
// Soft delete filter when getting a single service
// serviceSchema.pre('findOne', function (next) {
//   this.findOne({ isDeleted: { $ne: true } });
//   next();
// });
// Soft delete filter for aggregation queries
serviceSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
