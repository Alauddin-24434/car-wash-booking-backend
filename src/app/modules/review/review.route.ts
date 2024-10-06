import { Router } from "express";
import { reviewControllers } from "./review.controller";


const router = Router();

router.post("/reviews", reviewControllers.createReview); // Create a new review
router.get("/reviews", reviewControllers.getAllReviews); // Create a new review
router.get("/reviews/service/:serviceId", reviewControllers.getReviewsByService); // Get reviews by service
router.get("/reviews/:reviewId", reviewControllers.getReviewById); // Get a specific review
router.put("/reviews/:reviewId", reviewControllers.updateReview); // Update a review
router.delete("/reviews/:reviewId", reviewControllers.deleteReview); // Delete a review

export const reviewRoutes= router;
