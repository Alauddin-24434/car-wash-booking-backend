"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const service_controller_1 = require("./service.controller");
const validateTequest_1 = __importDefault(require("../../middlewares/validateTequest"));
const service_zodValidation_1 = require("./service.zodValidation");
// import authValidation from "../../middlewares/auth";
const uploadMiddleware_1 = __importDefault(require("../../middlewares/multer/uploadMiddleware"));
const router = express_1.default.Router();
router.post("/service", uploadMiddleware_1.default.array("images", 5), service_controller_1.serviceControllers.createService);
router.get("/services", service_controller_1.serviceControllers.getAllServices);
router.get("/services/:id", service_controller_1.serviceControllers.getSingleService);
//Update Services (Only Accessible by Admin)
router.put("/services/:id", (0, validateTequest_1.default)(service_zodValidation_1.zodServiceValidations.updateServiceZodValidationSchema), service_controller_1.serviceControllers.UpdateServiceById);
// delete service
router.delete("/services/:id", service_controller_1.serviceControllers.deletedServiceById);
exports.ServicesRoutes = router;
