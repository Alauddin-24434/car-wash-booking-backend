import { z } from "zod";

const slotZodValidationSchema = z.object({
  body: z.object({
    service: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    isBooked: z.string(),
  }),
});



export const slotzodValidations = {
    slotZodValidationSchema
 
};
