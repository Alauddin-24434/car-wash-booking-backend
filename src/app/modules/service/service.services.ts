import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TService } from './service.interface';
import { Service } from './service.model';

// Helper function to find a service by ID and check if it exists and is not soft-deleted
const findService = async (id: string) => {
  const service = await Service.findById(id);
  if (!service || service.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found!');
  }
  return service;
};

// Create a new service in the database
const createServiceServicesIntoDB = async (payload: TService) => {
  const service = await Service.create(payload);
  return service;
};

// Get all services from the database
const getAllServicesIntoDB = async () => {
  const services = await Service.find({ isDeleted: { $ne: true } });
  return services;
};

// Get a single service by ID from the database
const getSingleServiceIntoDB = async (id: string) => {
  return findService(id);
};

// Update a service by ID in the database
const updateServicesIntoDB = async (id: string, payload: TService) => {
  await findService(id); // Ensure the service exists before updating
  const updatedService = await Service.updateOne({ _id: id }, payload);
  if (updatedService.modifiedCount) {
    return findService(id); // Return the updated service
  }
  throw new AppError(httpStatus.NOT_MODIFIED, 'Service update failed!');
};

// Soft delete a service by ID in the database
const deletedServicesIntoDB = async (id: string) => {
  await findService(id);
  await Service.updateOne({ _id: id }, { isDeleted: true });
  const result= await Service.findById(id)
  return result;
 
};

// Export all service functions
export const services = {
  createServiceServicesIntoDB,
  getAllServicesIntoDB,
  getSingleServiceIntoDB,
  updateServicesIntoDB,
  deletedServicesIntoDB
};
