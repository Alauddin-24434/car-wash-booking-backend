import { model, Schema } from "mongoose"
import { IService } from "./service.interface"


const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    duration: { type: Number, required: true },
    image: { type: String, required: true },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)


export const Service = model<IService>("Service", serviceSchema)
