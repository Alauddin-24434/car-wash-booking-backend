import express from "express";
import { serviceControllers } from "./service.controller";

import validateRequest from "../../middlewares/validateTequest";
import { zodServiceValidations } from "./service.zodValidation";
// import authValidation from "../../middlewares/auth";
import upload from "../../middlewares/multer/uploadMiddleware";

const router = express.Router();

router.post(
  "/service",
  
  upload.array("images",5),
  serviceControllers.createService,
);

router.get("/services", serviceControllers.getAllServices);
router.get("/services/:id", serviceControllers.getSingleService);

//Update Services (Only Accessible by Admin)

router.put(
  "/services/:id",
 
  validateRequest(zodServiceValidations.updateServiceZodValidationSchema),
  serviceControllers.UpdateServiceById,
);

// delete service
router.delete(
  "/services/:id",
  
  serviceControllers.deletedServiceById,
);

export const ServicesRoutes = router;
