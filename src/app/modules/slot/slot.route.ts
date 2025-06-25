import express from "express";
import { createSlots, deleteSlot, getSingleSlot, getSlots, updateSlot } from "./slot.controllers";


const router = express.Router();

// Create slot - serviceId param in URL, validation middleware enabled
router.post(
  "/slot",
  createSlots
);

// Get all slots
router.get("/slots", getSlots);

// (Optional) Get single slot by ID
router.get("/slot/:id", getSingleSlot);

// (Optional) Update slot by ID
router.put(
  "/slot/:id",
  updateSlot
);

// (Optional) Delete slot by ID
router.delete("/slot/:id", deleteSlot);

export const SlotRoutes = router;
