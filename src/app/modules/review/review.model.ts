import { Schema, model, Document } from "mongoose";
import { IReview } from "./review.interface";

// Review Schema
const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    }
  },
  { timestamps: true }
);

// Create Review Model
export const Review = model<IReview>("Review", reviewSchema);
