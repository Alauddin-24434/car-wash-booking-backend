import { model, Schema } from "mongoose";
import { TService } from "./service.interface";


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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// soft delete filter when getAll service request
serviceSchema.pre('find', function(next){
  this.find({isDeleted:{$ne:true}})
  next()
})


// soft delete filter when getSingle sirvece find req

serviceSchema.pre('findOne', function(next){
  this.findOne({isDeleted:{$ne:true}})
  next()
})



  serviceSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
  });
  
export const Service = model<TService>('Service', serviceSchema);


