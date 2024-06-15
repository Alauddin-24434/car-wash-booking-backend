"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const slot_controllers_1 = require("./slot.controllers");
const slot_zodValidation_1 = require("./slot.zodValidation");
const validateTequest_1 = __importDefault(require("../../middlewares/validateTequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/services/slots', (0, auth_1.default)('admin'), (0, validateTequest_1.default)(slot_zodValidation_1.slotzodValidations.slotZodValidationSchema), slot_controllers_1.slotControllers.createSlot);
router.get('/slots/availability', slot_controllers_1.slotControllers.getAvailableSlots);
exports.SlotRoutes = router;
