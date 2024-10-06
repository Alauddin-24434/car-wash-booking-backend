import { Review } from "./review.model";
import { IReview } from "./review.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// Create a new review
const createReview = async (reviewData: IReview) => {
  const newReview = await Review.create(reviewData);
  return newReview;
};

// Get all reviews for a specific service
const getAllReviews = async () => {
  // Sort by creation date (assuming there's a 'createdAt' field)
  const reviews = await Review.find()
    .populate("userId")
    .sort({ createdAt: -1 }); // Sort by 'createdAt' in descending order (-1)

  return reviews;
};
// Get all reviews for a specific service
const getReviewsByService = async (serviceId: string) => {
  const reviews = await Review.find({ serviceId }).populate("userId", "name");
  return reviews;
};

// Get a specific review by ID
const getReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId).populate("userId", "name");
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }
  return review;
};

// Update a review
const updateReview = async (reviewId: string, reviewData: Partial<IReview>) => {
  const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, {
    new: true,
  });
  if (!updatedReview) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }
  return updatedReview;
};

// Delete a review (Soft delete, if necessary)
const deleteReview = async (reviewId: string) => {
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  if (!deletedReview) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }
  return deletedReview;
};

export const reviewServices = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByService,
  updateReview,
  deleteReview,
};
