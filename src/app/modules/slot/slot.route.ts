import express from "express";
import { slotControllers } from "./slot.controllers";

import { slotzodValidations } from "./slot.zodValidation";
import validateRequest from "../../middlewares/validateTequest";
import authValidation from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/slots",
  // authValidation("admin"),
  validateRequest(slotzodValidations.slotZodValidationSchema),
  slotControllers.createSlot,
);

router.get("/slots/availability", slotControllers.getAvailableSlots);

export const SlotRoutes = router;
