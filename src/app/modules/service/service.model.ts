import { model, Schema } from "mongoose";
import { TService } from "./service.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const serviceSchema = new Schema<TService>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    image: {
      type:String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

serviceSchema.pre("updateOne", async function (next) {
  const filter = this.getFilter();
  const service = await Service.findById(filter._id);
  if (!service) {
    throw new AppError(httpStatus.BAD_REQUEST, "Deleted id does not exist!");
  }
  next();
});

// Soft delete filter when getting all services
// serviceSchema.pre('find', function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// Soft delete filter when getting a single service
// serviceSchema.pre('findOne', function (next) {
//   this.findOne({ isDeleted: { $ne: true } });
//   next();
// });

// Soft delete filter for aggregation queries
serviceSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Service = model<TService>("Service", serviceSchema);
