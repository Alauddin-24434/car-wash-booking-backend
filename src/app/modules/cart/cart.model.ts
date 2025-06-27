import mongoose from "mongoose";
import { slotSchema } from "../slot/slot.model";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedDate: { type: String, required: true },
    selectedSlots: [slotSchema],
  
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
