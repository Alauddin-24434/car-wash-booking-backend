import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import * as paymentService from "./payment.service";

// Initiate AamarPay Payment
export const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.initiatePayment(req.body);
  res.status(result.success ? 200 : 400).json(result);
});

// AamarPay → Success Callback
export const handleSuccess = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.handlePaymentSuccess(req.body);
  res.redirect(`/payment-success?message=${encodeURIComponent(result.message)}`);
});

// AamarPay → Fail Callback
export const handleFail = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.handlePaymentFailOrCancel(req.body, "failed");
  res.redirect(`/payment-fail?message=${encodeURIComponent(result.message)}`);
});

// AamarPay → Cancel Callback
export const handleCancel = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.handlePaymentFailOrCancel(req.body, "cancelled");
  res.redirect(`/payment-cancel?message=${encodeURIComponent(result.message)}`);
});
