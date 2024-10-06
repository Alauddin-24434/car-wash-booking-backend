"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/auth/signup', user_controller_1.userControllers.createUser);
router.get("/user/:id", user_controller_1.userControllers.getUserById);
router.get("/users", user_controller_1.userControllers.getAllUsers);
router.put('/users/:id', (0, auth_1.default)('admin'), user_controller_1.userControllers.updateUserRole);
router.put('/users/throughUser/:id', (0, auth_1.default)('user'), user_controller_1.userControllers.updateUserThroughUser);
exports.userRoutes = router;
