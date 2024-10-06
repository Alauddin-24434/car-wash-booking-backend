import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";


// Create user
const createUser = catchAsync(async (req, res) => {
  const bodyData = req.body;


  // Attach the userImage to the request body if it exists
  const result = await userServices.createUserIntoDB(bodyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});

// get user by id
const getUserById = catchAsync(async (req, res) => {
const id= req.params.id;
console.log(id)
  const result = await userServices.getUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is find successfully",
    data: result,
  });
});
// get all users
const getAllUsers = catchAsync(async (req, res) => {


  const result = await userServices.getAllUsersIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is find successfully",
    data: result,
  });
});

// Update user role
const updateUserRole = catchAsync(async (req, res) => {
  const { role } = req.body; // Assuming role is sent in the body
  const userId=req.params.id;
  const result = await userServices.updateUserRoleInDB(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result, 
  });
});
const updateUserThroughUser = catchAsync(async (req, res) => {
  const data= req.body; // Assuming role is sent in the body
  const userId=req.params.id;
  const result = await userServices.updateUserDataThroughUser(userId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result, 
  });
});

export const userControllers = {
  createUser,
  getUserById,
  updateUserThroughUser,
  getAllUsers,
  updateUserRole, // Export the new controller function
};