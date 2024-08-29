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



export const userControllers = {
  createUser,

};
