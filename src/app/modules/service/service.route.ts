import express from 'express';
import { serviceControllers } from './service.controller';
import authMiddleware from '../../auth/authMiddleware';
import validateRequest from '../../middlewares/validateTequest';
import { zodServiceValidations } from './service.zodValidation';


const router= express.Router();

router.post('/services', authMiddleware, validateRequest(zodServiceValidations.serviceZodValidationSchema),  serviceControllers.createService)

router.get('/services', serviceControllers.getAllServices)
router.get('/services/:id',   serviceControllers.getSingleService)


//Update Services (Only Accessible by Admin)

router.put('/services/:id', authMiddleware, validateRequest(zodServiceValidations.updateServiceZodValidationSchema),  serviceControllers.UpdateServiceById)

// delete service 
router.delete('/services/:id', authMiddleware,   serviceControllers.deletedServiceById)

export const ServicesRoutes= router;