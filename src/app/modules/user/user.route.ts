import express from 'express';
import { userControllers } from './user.controller';
import { zodUserValidations } from './user.zodValidition';
import validateRequest from '../../middlewares/validateTequest';


const router=express.Router();

router.post('/auth/signup' , validateRequest(zodUserValidations.zodUserValidationSchema) , userControllers.createUser )

// user login route

router.post('/auth/login' ,userControllers.loginUser)

export const userRoutes= router;