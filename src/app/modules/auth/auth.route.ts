import express from 'express';
import { AuthValidation } from './auth.zodValidation';
import validateRequest from '../../middlewares/validateTequest';
import { AuthControllers } from './auth.controller';


const router = express.Router();

router.post('/auth/login',validateRequest(AuthValidation.loginValidationSchema), AuthControllers.loginUser,)



export const AuthRoutes = router;