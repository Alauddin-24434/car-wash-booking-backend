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
exports.userControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
// Create user
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyData = req.body;
    const result = yield user_service_1.userServices.createUserIntoDB(bodyData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is created successfully",
        data: result,
    });
}));
// Login user
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validate email and password
    if (!email || !password) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: "Email and password are required",
        });
    }
    // Find the user by email
    const user = yield user_service_1.userServices.loginUserIntoDB(email);
    if (!user) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            statusCode: http_status_1.default.UNAUTHORIZED,
            message: "Invalid email or password",
        });
    }
    // Compare the provided password with the stored hashed password
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            statusCode: http_status_1.default.UNAUTHORIZED,
            message: "Invalid email or password",
        });
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({
        sub: user._id,
        name: user.name,
        email: user.email,
    }, config_1.default.jwt_access_secret, { expiresIn: "1h" });
    // console.log(token)
    // Remove password from user object before sending the response
    // Return response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged in successfully",
        token,
        data: user,
    });
}));
exports.userControllers = {
    createUser,
    loginUser,
};
