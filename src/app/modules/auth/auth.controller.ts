import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import AppError from "../../error/AppError";

const loginUser = catchAsync(async (req, res) => {
  const loginData = await AuthServices.loginUser(req.body);
  const { accessToken, refreshToken } = loginData;


  
  res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production', // Set to `true` in production
        httpOnly: true,
    });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    data: {accessToken},
  });
});


const refreshToken = catchAsync(async (req, res) => {
  const {refreshToken} = req.cookies;
 

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token is required!');
  }

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});











export const AuthControllers = {
  loginUser,
  refreshToken
};
