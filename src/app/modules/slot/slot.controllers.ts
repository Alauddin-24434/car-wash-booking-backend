
import catchAsync from "../../utils/catchAsync";
import { slotService } from "./slot.services";

export const createSlots = catchAsync(async (req, res) => {
  const payload = req.body;
  const createdSlots = await slotService.createSlotsIntoDB(payload);
  console.log("res",createSlots)
  res.status(201).json({
    success: true,
    data: createdSlots,
    message: "Slot(s) created successfully",
  });
});

export const getSlots = catchAsync(async (req, res) => {
  const queryParams = req.query as any;
  const { slots, meta } = await slotService.getSlotsFromDB(queryParams);
  res.status(200).json({
    success: true,
    data: slots,
    meta,
  });
});

export const getSingleSlot = catchAsync(async (req, res) => {
  const id = req.params.id;
  const slot = await slotService.findSingleSlot(id);

  res.status(200).json({
    success: true,
    data: slot,
  });
});

export const updateSlot = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const updatedSlot = await slotService.updateSlotIntoDB(id, payload);
  res.status(200).json({
    success: true,
    data: updatedSlot,
    message: "Slot updated successfully",
  });
});

export const deleteSlot = catchAsync(async (req, res) => {
  const id = req.params.id;
  const deletedSlot = await slotService.deleteSlotIntoDB(id);
  res.status(200).json({
    success: true,
    data: deletedSlot,
    message: "Slot deleted successfully",
  });
});
