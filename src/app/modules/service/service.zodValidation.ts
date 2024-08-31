import { z } from "zod";

const serviceZodValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    duration: z.number(),
    image:z.string(),

    isDeleted: z.boolean(),
  }),
});
const updateServiceZodValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    duration: z.number().optional(),
    image:z.string(),
    isDeleted: z.boolean().optional(),
  }),
});

export const zodServiceValidations = {
  serviceZodValidationSchema,
  updateServiceZodValidationSchema,
};
