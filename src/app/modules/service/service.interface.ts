import { Schema, model, Document } from "mongoose"

// 1️⃣ TypeScript Interface for Mongoose Document
export interface IService extends Document {
  name: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  features: string[]
  isDeleted:boolean
  popular: boolean
  discount: number
}
