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
exports.AuthControllers = exports.refreshAccessToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const generateTokens_1 = require("../../utils/generateTokens");
// ============================================================signup  user================================================================
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imgUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const bodyData = Object.assign(Object.assign({}, req.body), { image: imgUrl });
    console.log(bodyData);
    // Attach the userImage to the request body if it exists
    const user = yield auth_service_1.AuthServices.createUserIntoDB(bodyData);
    console.log(user);
    const payload = { id: user._id, role: user.role };
    // accessToken
    const accessToken = (0, generateTokens_1.createAccessToken)(payload);
    //refresstoken
    const refresstoken = (0, generateTokens_1.createRefreshToken)(payload);
    //  Set refresh token in secure HttpOnly cookie
    res.cookie("refreshToken", refresstoken, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is created successfully',
        data: {
            accessToken,
            user
        }
    });
}));
// ==============================================================================login user=================================================================
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Attach the userImage to the request body if it exists
    const user = yield auth_service_1.AuthServices.loginUser(req.body);
    // Create tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = (0, generateTokens_1.createAccessToken)(payload);
    const refreshToken = (0, generateTokens_1.createRefreshToken)(payload);
    //  Set refresh token in secure cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is logged in succesfully!",
        data: { accessToken, user },
    });
}));
// ======================================================refresh token ==============================================
exports.refreshAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || req.headers["x-refresh-token"];
    if (!refreshToken) {
        throw new AppError_1.default(401, "Refresh token missing");
    }
    const accessToken = yield auth_service_1.AuthServices.handleRefreshToken(refreshToken);
    res.status(200).json({
        success: true,
        accessToken,
    });
}));
exports.AuthControllers = {
    loginUser,
    refreshAccessToken: exports.refreshAccessToken,
    createUser,
};
