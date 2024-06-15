"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodUserValidations = void 0;
const zod_1 = require("zod");
const zodUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string(),
        password: zod_1.z.string(),
        phone: zod_1.z.string(),
        role: zod_1.z.enum(["user", "admin"]),
        address: zod_1.z.string(),
    })
});
exports.zodUserValidations = {
    zodUserValidationSchema,
};
