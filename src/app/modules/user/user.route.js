"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_zodValidition_1 = require("./user.zodValidition");
const validateTequest_1 = __importDefault(require("../../middlewares/validateTequest"));
const router = express_1.default.Router();
router.post("/auth/signup", (0, validateTequest_1.default)(user_zodValidition_1.zodUserValidations.zodUserValidationSchema), user_controller_1.userControllers.createUser);
// user login route
// router.post('/auth/login' ,userControllers.loginUser)
exports.userRoutes = router;
