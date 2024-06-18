"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingzodValiditions = exports.VehicleTypeEnum = void 0;
const zod_1 = require("zod");
exports.VehicleTypeEnum = zod_1.z.enum([
    "car",
    "truck",
    "SUV",
    "van",
    "motorcycle",
    "bus",
    "electricVehicle",
    "hybridVehicle",
    "bicycle",
    "tractor",
]);
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const zodbookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        serviceId: zod_1.z
            .string()
            .regex(objectIdRegex, { message: "Invalid service ID" }),
        slotId: zod_1.z.string().regex(objectIdRegex, { message: "Invalid slot ID" }),
        vehicleType: exports.VehicleTypeEnum,
        vehicleBrand: zod_1.z.string(),
        vehicleModel: zod_1.z.string(),
        manufacturingYear: zod_1.z.number(),
        registrationPlate: zod_1.z.string(),
    }),
});
exports.bookingzodValiditions = {
    zodbookingSchema,
};
