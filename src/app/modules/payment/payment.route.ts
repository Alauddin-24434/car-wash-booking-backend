import express from "express";
import {
  initiatePayment,
  handleSuccess,
  handleFail,
  handleCancel,
} from "./payment.controller";

const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/success", handleSuccess); // AamarPay success redirect
router.post("/fail", handleFail);
router.post("/cancel", handleCancel);

export default router;
