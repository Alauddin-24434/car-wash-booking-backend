import express from "express";
import { userControllers } from "./user.controller";
import { zodUserValidations } from "./user.zodValidition";
import validateRequest from "../../middlewares/validateTequest";

const router = express.Router();

router.post(
  "/auth/signup",
  validateRequest(zodUserValidations.zodUserValidationSchema),
  userControllers.createUser,
);

router.get(
  "/user/:id",
 
  userControllers.getUserById,
);



export const userRoutes = router;
