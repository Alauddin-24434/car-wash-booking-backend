
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { services } from './service.services';


// Create service
const createService = catchAsync(async (req, res) => {
  

  const serviceData = req.body;

  const result = await services.createServiceServicesIntoDB(serviceData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});


// Create service
const getAllServices = catchAsync(async (req, res) => {
  



  const result = await services.getAllServicesIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});


// Create service
const getSingleService = catchAsync(async (req, res) => {
  

  const findById = req.params.id;

  const result = await services.getSingleServiceIntoDB(findById);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});





//Update Services (Only Accessible by Admin)

const UpdateServiceById = catchAsync(async (req, res) => {
  
const paramsId=req.params.id;
    const updateData = req.body;

    const result = await services.updateServicesIntoDB(paramsId,updateData);
    console.log(result)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Service updated successfully',
      data: result,
    });
  });

const deletedServiceById = catchAsync(async (req, res) => {
  
const paramsId=req.params.id;


    const result = await services.deletedServicesIntoDB(paramsId);
    console.log(result)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Service deleted successfully',
      data: result,
    });
  });


export const serviceControllers = {
  createService,
  UpdateServiceById,
  deletedServiceById,
  getAllServices,
  getSingleService
};
