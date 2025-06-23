"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_zodValidation_1 = require("./auth.zodValidation");
const validateTequest_1 = __importDefault(require("../../middlewares/validateTequest"));
const auth_controller_1 = require("./auth.controller");
const uploadMiddleware_1 = __importDefault(require("../../middlewares/multer/uploadMiddleware"));
const router = express_1.default.Router();
router.post('/auth/signup', uploadMiddleware_1.default.single("image"), auth_controller_1.AuthControllers.createUser);
router.post("/auth/login", (0, validateTequest_1.default)(auth_zodValidation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post('/auth/refresh-token', 
// validateRequest(AuthValidation.refreshTokenValidationSchema),
auth_controller_1.AuthControllers.refreshAccessToken);
exports.AuthRoutes = router;
