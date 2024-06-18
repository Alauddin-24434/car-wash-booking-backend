import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const loginData = await AuthServices.loginUser(req.body);
  const { accessToken: token, user } = loginData;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    token: token,
    data: user,
  });
});

export const AuthControllers = {
  loginUser,
};
