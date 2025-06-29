import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import * as paymentService from "./payment.service";
import { generatePaymentHtml } from "./payment.template";


// AamarPay → Success Callback
export const handleSuccess = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.query;
  await paymentService.handlePaymentSuccess(transactionId as string);
  res.send(generatePaymentHtml("success", transactionId as string));
});
export const handleFail = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.query;
  await paymentService.handlePaymentFailOrCancel(transactionId as string, "failed");
  res.send(generatePaymentHtml("failed"));
});

export const handleCancel = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.query;
  await paymentService.handlePaymentFailOrCancel(transactionId as string, "cancelled");
  res.send(generatePaymentHtml("cancelled"));
});
