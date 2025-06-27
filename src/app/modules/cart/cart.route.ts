// routes/cart.route.ts
import express from "express";
import { addToCart, clearCart, getUserCart } from "./cart.controller";

const router = express.Router();

router.post("/cart", addToCart); // POST /api/cart
router.get("/cart/:userId", getUserCart); // GET /api/cart/:userId
router.delete("cart/:userId", clearCart); // DELETE /api/cart/:userId

export const cartRoute= router;
