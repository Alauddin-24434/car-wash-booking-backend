import express from "express";
import { AuthValidation } from "./auth.zodValidation";
import validateRequest from "../../middlewares/validateTequest";
import { AuthControllers } from "./auth.controller";
import upload from "../../middlewares/multer/uploadMiddleware";

const router = express.Router();


router.post('/auth/signup', upload.single("image"),  AuthControllers.createUser );


router.post(
  "/auth/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);








router.post(
  '/auth/refresh-token',

  // validateRequest(AuthValidation.refreshTokenValidationSchema),

  AuthControllers.refreshAccessToken,
);











export const AuthRoutes = router;
