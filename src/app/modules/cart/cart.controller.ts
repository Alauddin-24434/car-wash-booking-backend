// controllers/cart.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { Cart } from "./cart.model";
import { Slot } from "../slot/slot.model";
export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const cartItem = req.body;
  const { serviceId, selectedDate, selectedSlots } = cartItem;

  // ১. Check if any of the selected slots already booked in the cart
  for (const slot of selectedSlots) {
    const { startTime } = slot;

    const alreadyTaken = await Cart.findOne({
      serviceId,
      selectedDate,
      "selectedSlots.startTime": startTime,
    });

    if (alreadyTaken) {
      return res.status(400).json({
        message: `Slot at ${startTime} on ${selectedDate} is already booked.`,
      });
    }
  }

  // ২. quantity কে selectedSlots.length দিয়ে সেট করা হচ্ছে
  cartItem.quantity = selectedSlots.length;

  // ৩. Create cart item with updated quantity
  const created = await Cart.create(cartItem);

  res.status(201).json({ message: "Added to cart", data: created });
});




export const getUserCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const cartItems = await Cart.find({ userId });
  res.status(200).json({ data: cartItems });
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  await Cart.deleteMany({ userId });
  res.status(200).json({ message: "Cart cleared" });
});
