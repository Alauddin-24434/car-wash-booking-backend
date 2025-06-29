import express from "express";
import {
 
  handleSuccess,
  handleFail,
  handleCancel,
} from "./payment.controller";

const router = express.Router();

// router.post("/initiate", initiatePayment);
router.post("/payments/success", handleSuccess); // AamarPay success redirect
router.post("/payments/fail", handleFail);
router.post("/payments/cancel", handleCancel);

export const paymentRoute=router;
