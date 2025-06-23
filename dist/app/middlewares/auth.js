"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../error/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
// Middleware function to validate authentication and authorization
const authValidation = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the token from the Authorization header
        const token = req.headers.authorization;
        // Check if the token is missing
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        let decoded;
        try {
            // Verify the token
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            // Token is invalid or expired
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
        }
        const { role, userId, } = decoded;
        // Check if the user exists
        const user = yield user_model_1.User.isUserExistsByCustomId(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
        }
        // Check if the user is deleted
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted!");
        }
        // Check if the user has the required role
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // Attach the user information to the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    }));
};
exports.default = authValidation;
