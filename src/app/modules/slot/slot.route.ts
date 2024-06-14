import express from 'express';
import { slotControllers } from './slot.controllers';
import authMiddleware from '../../auth/authMiddleware';
import { slotzodValidations } from './slot.zodValidation';
import validateRequest from '../../middlewares/validateTequest';

const router= express.Router();

router.post('/services/slots', authMiddleware, slotControllers.createSlot, validateRequest(slotzodValidations.slotZodValidationSchema))


router.get('/slots/availability', slotControllers.getAvailableSlots)

export const SlotRoutes= router;