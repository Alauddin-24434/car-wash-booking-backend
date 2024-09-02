import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";


// Create user
const createUser = catchAsync(async (req, res) => {
  const bodyData = req.body;
  const result = await userServices.createUserIntoDB(bodyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully",
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



export const userControllers = {
  createUser,
  getUserById

};
