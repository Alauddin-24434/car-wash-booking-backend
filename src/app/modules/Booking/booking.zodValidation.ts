import { z } from "zod";



const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const zodbookingSchema = z.object({
  body: z.object({
    customerId:z.string().regex(objectIdRegex, {message: "Invalid CustomerId"}),
    serviceId: z
      .string()
      .regex(objectIdRegex, { message: "Invalid service ID" }),
    slotId: z.string().regex(objectIdRegex, { message: "Invalid slot ID" }),
  
  }),
});

export const bookingzodValiditions = {
  zodbookingSchema,
};
