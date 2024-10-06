"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
router.post("/reviews", review_controller_1.reviewControllers.createReview); // Create a new review
router.get("/reviews", review_controller_1.reviewControllers.getAllReviews); // Create a new review
router.get("/reviews/service/:serviceId", review_controller_1.reviewControllers.getReviewsByService); // Get reviews by service
router.get("/reviews/:reviewId", review_controller_1.reviewControllers.getReviewById); // Get a specific review
router.put("/reviews/:reviewId", review_controller_1.reviewControllers.updateReview); // Update a review
router.delete("/reviews/:reviewId", review_controller_1.reviewControllers.deleteReview); // Delete a review
exports.reviewRoutes = router;
