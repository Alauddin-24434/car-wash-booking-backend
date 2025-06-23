import express from "express";
import { userControllers } from "./user.controller";
import { zodUserValidations } from "./user.zodValidition";
import validateRequest from "../../middlewares/validateTequest";
import authValidation from "../../middlewares/auth";


const router = express.Router();


router.get(
  "/user/:id",
 
  userControllers.getUserById,
);
router.get(
  "/users",
 
  userControllers.getAllUsers,
);
router.put('/users/:id',authValidation('admin'),  userControllers.updateUserRole);
router.put('/users/throughUser/:id',authValidation('user'),  userControllers.updateUserThroughUser);


export const userRoutes = router;
