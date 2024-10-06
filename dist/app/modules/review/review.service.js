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
exports.reviewServices = void 0;
const review_model_1 = require("./review.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Create a new review
const createReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const newReview = yield review_model_1.Review.create(reviewData);
    return newReview;
});
// Get all reviews for a specific service
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    // Sort by creation date (assuming there's a 'createdAt' field)
    const reviews = yield review_model_1.Review.find()
        .populate("userId")
        .sort({ createdAt: -1 }); // Sort by 'createdAt' in descending order (-1)
    return reviews;
});
// Get all reviews for a specific service
const getReviewsByService = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find({ serviceId }).populate("userId", "name");
    return reviews;
});
// Get a specific review by ID
const getReviewById = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId).populate("userId", "name");
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return review;
});
// Update a review
const updateReview = (reviewId, reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedReview = yield review_model_1.Review.findByIdAndUpdate(reviewId, reviewData, {
        new: true,
    });
    if (!updatedReview) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return updatedReview;
});
// Delete a review (Soft delete, if necessary)
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedReview = yield review_model_1.Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
    }
    return deletedReview;
});
exports.reviewServices = {
    createReview,
    getAllReviews,
    getReviewById,
    getReviewsByService,
    updateReview,
    deleteReview,
};
