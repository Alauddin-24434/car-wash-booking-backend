import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { services } from "./service.services";

// Create service
const createService = catchAsync(async (req, res) => {
  console.log(req.body)
  // req.files is an array of uploaded files
  const imageUrl = req.file?.path;

  const serviceData = {
    ...req.body,
    image: imageUrl,
  };
  console.log(serviceData)
  const result = await services.createServiceServicesIntoDB(serviceData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});


// const getAllServices = catchAsync(async (req, res) => {
//   const query = req.query;
//   const result = await services.getAllServicesIntoDB(query);
//   const { total, limit, page, services: serviceData } = result;
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Service retrieved successfully",
//     data: {
//       data: serviceData,
//       meta: {
//         total,
//         limit,
//         page
//       }
//     },
//   });
// });


const getServices = catchAsync(async (req, res) => {
  const {
    searchTerm,
    category,
    popular,
    priceMin,
    priceMax,
    sort = "-createdAt",
    limit = 10,
    page = 1,
  } = req.query;

  const result = await services.getServicesFromDB({
    searchTerm: searchTerm as string,
    category: category as string,
    popular: popular === "true",
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    sort: sort as string,
    limit: Number(limit),
    page: Number(page),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully",
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
    message: "Service retrieved successfully",
    data: result,
  });
});

//Update Services (Only Accessible by Admin)

const UpdateServiceById = catchAsync(async (req, res) => {
  const paramsId = req.params.id;
  const imageUrl = req.file?.path;
  const updateData = {
    ...req.body,
    image: imageUrl,
  }

  const result = await services.updateServicesIntoDB(paramsId, updateData);
  // console.log(result)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});

const deletedServiceById = catchAsync(async (req, res) => {
  const paramsId = req.params.id;

  const result = await services.deletedServicesIntoDB(paramsId);
  // console.log(result)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully",
    data: result,
  });
});

export const serviceControllers = {
  createService,
  UpdateServiceById,
  deletedServiceById,
  getServices,
  getSingleService,
};
