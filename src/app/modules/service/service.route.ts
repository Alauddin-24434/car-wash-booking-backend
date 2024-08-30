import express from "express";
import { serviceControllers } from "./service.controller";

import validateRequest from "../../middlewares/validateTequest";
import { zodServiceValidations } from "./service.zodValidation";
import authValidation from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/services",
  // authValidation("admin"),
  validateRequest(zodServiceValidations.serviceZodValidationSchema),
  serviceControllers.createService,
);

router.get("/services", serviceControllers.getAllServices);
router.get("/services/:id", serviceControllers.getSingleService);

//Update Services (Only Accessible by Admin)

router.put(
  "/services/:id",
  authValidation("admin"),
  validateRequest(zodServiceValidations.updateServiceZodValidationSchema),
  serviceControllers.UpdateServiceById,
);

// delete service
router.delete(
  "/services/:id",
  authValidation("admin"),
  serviceControllers.deletedServiceById,
);

export const ServicesRoutes = router;
