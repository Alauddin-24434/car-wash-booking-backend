import { Request, Response, NextFunction } from "express";
import { reviewServices } from "./review.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Create a new review
const createReview = catchAsync(async (req, res) => {
  const newReview = await reviewServices.createReview(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
    data: newReview,
  });
});

// Get all reviews for a service
const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await reviewServices.getAllReviews();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
    data: reviews,
  });
});
const getReviewsByService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await reviewServices.getReviewsByService(
      req.params.serviceId
    );
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// Get a single review by ID
const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await reviewServices.getReviewById(req.params.reviewId);
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

// Update a review
const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedReview = await reviewServices.updateReview(
      req.params.reviewId,
      req.body
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedReview = await reviewServices.deleteReview(
      req.params.reviewId
    );
    res.status(200).json(deletedReview);
  } catch (error) {
    next(error);
  }
};

export const reviewControllers = {
  createReview,
  getReviewsByService,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews,
};
