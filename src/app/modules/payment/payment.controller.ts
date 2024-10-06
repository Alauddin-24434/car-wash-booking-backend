import { Request, Response } from "express";
import { createPayment, verifyAndUpdatePaymentStatus } from "./payment.service";
import catchAsync from "../../utils/catchAsync";

export const initiatePaymentHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { bookingId } = req.body;

    try {
      const payment = await createPayment(bookingId);
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: (error as Error)?.message });
    }
  }
);
export const manualPaymentVerificationHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { transactionId } = req.query;
    console.log("Received transactionId:", transactionId);

    try {
      const payment = await verifyAndUpdatePaymentStatus(
        transactionId as string
      );



      
      res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Success</title>
                <style>
body {
    background: #999;
}

.container {
    max-width: 380px;
    margin: 30px auto;
    overflow: hidden;
}

.printer-top {
    z-index: 1;
    border: 6px solid #666666;
    height: 6px;
    border-bottom: 0;
    border-radius: 6px 6px 0 0;
    background: #333333;
}

.printer-bottom {
    z-index: 0;
    border: 6px solid #666666;
    height: 6px;
    border-top: 0;
    border-radius: 0 0 6px 6px;
    background: #333333;
}

.paper-container {
    position: relative;
    overflow: hidden;
    height: 467px;
}

.paper {
    background: #ffffff;
    height: 447px;
    position: absolute;
    z-index: 2;
    margin: 0 12px;
    margin-top: -12px;
    animation: print 2s cubic-bezier(0.68, -0.55, 0.265, 0.9) forwards; /* Play animation once */
}

.main-contents {
    margin: 0 12px;
    padding: 24px;
}

.jagged-edge {
    position: relative;
    height: 20px;
    width: 100%;
    margin-top: -1px;
}

.jagged-edge:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
    background-size: 16px 40px;
    background-position: 0 -20px;
}

.success-icon {
    text-align: center;
    font-size: 48px;
    height: 72px;
    background: #359d00;
    border-radius: 50%;
    width: 72px;
    height: 72px;
    margin: 16px auto;
    color: #fff;
}

.success-title {
    font-size: 22px;
    text-align: center;
    color: #666;
    font-weight: bold;
    margin-bottom: 16px;
}

.success-description {
    font-size: 15px;
    line-height: 21px;
    color: #999;
    text-align: center;
    margin-bottom: 24px;
}

.order-details {
    text-align: center;
    color: #333;
    font-weight: bold;
}

.order-number-label {
    font-size: 15px;
    margin-bottom: 8px;
}

.order-number {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    line-height: 48px;
    font-size: 20px;
    padding: 8px 0;
    margin-bottom: 24px;
}

.order-footer {
    text-align: center;
    line-height: 18px;
    font-size: 18px;
    margin-top: 50px;
    font-weight: bold;
    color: #999;
}

@keyframes print {
    0% {
        transform: translateY(-100%); /* Start position is completely out of view at the top */
    }
    100% {
        transform: translateY(0%); /* End position is fully in view at the bottom */
    }
}




                </style>
            </head>
            <body>
  <div class="container">
  <div class="printer-top"></div>
    
  <div class="paper-container">
    <div class="printer-bottom"></div>

    <div class="paper">
      <div class="main-contents">
        <div class="success-icon">&#10004;</div>
        <div class="success-title">
       Congratulations Payment Complete
        </div>
        <div class="success-description">
       
        </div>
        <div class="order-details">
          <div class="order-number-label">Transaction Number</div>
          <div class="order-number">${payment.transactionId}</div>
        </div>
        <div class="order-footer">
          <a href="https://car-wash-booking-services.vercel.app">Go to Homepage</a></div>
      </div>
      <div class="jagged-edge"></div>
    </div>
  </div>
</div>
            </body>
            </html>
        `);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
