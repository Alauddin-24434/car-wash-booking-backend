"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingzodValiditions = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const zodbookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty({ message: "Name is required" }),
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        serviceId: zod_1.z.string().regex(objectIdRegex, { message: "Invalid service ID" }),
        slotId: zod_1.z.string().regex(objectIdRegex, { message: "Invalid slot ID" }),
    }),
});
exports.bookingzodValiditions = {
    zodbookingSchema,
};
