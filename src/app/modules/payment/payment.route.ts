import { Router } from 'express';
import { initiatePaymentHandler, manualPaymentVerificationHandler } from './payment.controller';

const router = Router();

router.post('/initiate', initiatePaymentHandler);
router.post('/verify-payment', manualPaymentVerificationHandler);

export const paymentRoutes = router;
