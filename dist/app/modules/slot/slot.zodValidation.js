"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotzodValidations = void 0;
const zod_1 = require("zod");
const slotZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        service: zod_1.z.string(),
        date: zod_1.z.string(),
        startTime: zod_1.z.string(),
        endTime: zod_1.z.string(),
        isBooked: zod_1.z.string(),
    }),
});
exports.slotzodValidations = {
    slotZodValidationSchema
};
