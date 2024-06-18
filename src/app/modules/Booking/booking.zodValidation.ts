import { z } from "zod";

export const VehicleTypeEnum = z.enum([
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

const zodbookingSchema = z.object({
  body: z.object({
    serviceId: z
      .string()
      .regex(objectIdRegex, { message: "Invalid service ID" }),
    slotId: z.string().regex(objectIdRegex, { message: "Invalid slot ID" }),
    vehicleType: VehicleTypeEnum,
    vehicleBrand: z.string(),
    vehicleModel: z.string(),
    manufacturingYear: z.number(),

    registrationPlate: z.string(),
  }),
});

export const bookingzodValiditions = {
  zodbookingSchema,
};
