import express from "express";
import { serviceControllers } from "./service.controller";

import validateRequest from "../../middlewares/validateTequest";
import { zodServiceValidations } from "./service.zodValidation";
// import authValidation from "../../middlewares/auth";
import upload from "../../middlewares/multer/uploadMiddleware";

const router = express.Router();

router.post(
  "/service",
  
  upload.single("image"),
  serviceControllers.createService,
);

router.get("/services", serviceControllers.getServices);
router.get("/services/:id", serviceControllers.getSingleService);

//Update Services (Only Accessible by Admin)

router.put(
  "/services/:id",
 
  upload.single("image"),
  // validateRequest(zodServiceValidations.updateServiceZodValidationSchema),
  serviceControllers.UpdateServiceById,
);

// delete service
router.delete(
  "/services/:id",
  
  serviceControllers.deletedServiceById,
);

export const ServicesRoutes = router;
