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
exports.reviewControllers = void 0;
const review_service_1 = require("./review.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// Create a new review
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newReview = yield review_service_1.reviewServices.createReview(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is created successfully",
        data: newReview,
    });
}));
// Get all reviews for a service
const getAllReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_service_1.reviewServices.getAllReviews();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is created successfully",
        data: reviews,
    });
}));
const getReviewsByService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_service_1.reviewServices.getReviewsByService(req.params.serviceId);
        res.status(200).json(reviews);
    }
    catch (error) {
        next(error);
    }
});
// Get a single review by ID
const getReviewById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_service_1.reviewServices.getReviewById(req.params.reviewId);
        res.status(200).json(review);
    }
    catch (error) {
        next(error);
    }
});
// Update a review
const updateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedReview = yield review_service_1.reviewServices.updateReview(req.params.reviewId, req.body);
        res.status(200).json(updatedReview);
    }
    catch (error) {
        next(error);
    }
});
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedReview = yield review_service_1.reviewServices.deleteReview(req.params.reviewId);
        res.status(200).json(deletedReview);
    }
    catch (error) {
        next(error);
    }
});
exports.reviewControllers = {
    createReview,
    getReviewsByService,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
};
