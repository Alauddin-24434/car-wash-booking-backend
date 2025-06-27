import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";



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
const getUsers = catchAsync(async (req, res) => {

  const query= req.query;

  const result = await userServices.getUsersIntoDB(query);

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

  getUserById,
  updateUserThroughUser,
  getUsers,
  updateUserRole, // Export the new controller function
};