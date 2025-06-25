import httpStatus from "http-status";
import AppError from "../../error/AppError";

import { Service } from "./service.model";
import { IService } from "./service.interface";

// Helper function to find a service by ID and check if it exists and is not soft-deleted
const findService = async (id: string) => {
  const service = await Service.findById(id);
  if (!service || service.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found!");
  }
  return service;
};

// Create a new service in the database
const createServiceServicesIntoDB = async (payload: IService) => {
  const service = await Service.create(payload);
  return service;
};

// Get all services from the database
export interface IServiceQueryParams {
  searchTerm?: string;
  category?: string;
  popular?: boolean;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  limit?: number;
  page?: number;
}



const getServicesFromDB = async (params: IServiceQueryParams) => {
  const {
    searchTerm,
    category,
    priceMin,
    priceMax,
    sort = "-createdAt",
    limit = 10,
    page = 1,
  } = params;

  const skip = (page - 1) * limit;
  const filters: any = { isDeleted: false };

  // 🔍 Case-insensitive search (name + description)
  if (searchTerm?.trim()) {
    const regex = new RegExp(searchTerm.trim(), "i");
    filters.$or = [
      { name: regex },
      { description: regex },
    ];
  }

  // ✅ Only apply category filter if not "all"
  if (category && category.toLowerCase() !== "all") {
    filters.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  // 💰 Price filtering
  if (priceMin !== undefined || priceMax !== undefined) {
    filters.price = {};
    if (priceMin !== undefined) filters.price.$gte = priceMin;
    if (priceMax !== undefined) filters.price.$lte = priceMax;
  }

  // 🔍 Fetch from DB
  const services = await Service.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Service.countDocuments(filters);

  return {
    services,
    meta: {
      total,
      page,
      limit,
    },
  };
};



// Get a single service by ID from the database
const getSingleServiceIntoDB = async (id: string) => {
  
 
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError(404, "Service not found");
  }

  // Related services query (e.g., same category, excluding current one)
  const relatedServices = await Service.find({
    category: service.category,
    _id: { $ne: id },
  }).limit(4);

  return { service, relatedServices }

};

// Update a service by ID in the database
const updateServicesIntoDB = async (id: string, payload: IService) => {
  await findService(id); // Ensure the service exists before updating
  const updatedService = await Service.updateOne({ _id: id }, payload);
  if (updatedService.modifiedCount) {
    return findService(id); // Return the updated service
  }
  throw new AppError(httpStatus.NOT_MODIFIED, "Service update failed!");
};

// Soft delete a service by ID in the database
const deletedServicesIntoDB = async (id: string) => {
  await findService(id);
  await Service.updateOne({ _id: id }, { isDeleted: true });
  const result = await Service.findById(id);
  return result;
};

// Export all service functions
export const services = {
  createServiceServicesIntoDB,
  getServicesFromDB,
  getSingleServiceIntoDB,
  updateServicesIntoDB,
  deletedServicesIntoDB,
};
