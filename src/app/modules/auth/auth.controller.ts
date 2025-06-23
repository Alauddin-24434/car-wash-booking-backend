import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import AppError from "../../error/AppError";
import { createAccessToken, createRefreshToken } from "../../utils/generateTokens";




// ============================================================signup  user================================================================
const createUser = catchAsync(async (req, res) => {
 
  const imgUrl = req.file?.path;
  const bodyData = {
    ...req.body,
    image: imgUrl,
  }
console.log(bodyData)

  // Attach the userImage to the request body if it exists
  const user = await AuthServices.createUserIntoDB(bodyData);
  console.log(user)
  const payload = { id: user._id, role: user.role };

  // accessToken
  const accessToken = createAccessToken(payload);

  //refresstoken
  const refresstoken = createRefreshToken(payload);

  //  Set refresh token in secure HttpOnly cookie
  res.cookie("refreshToken", refresstoken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });




  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created successfully',
    data: {
      accessToken,
      user
    }
  });
});


// ==============================================================================login user=================================================================

const loginUser = catchAsync(async (req, res) => {

  // Attach the userImage to the request body if it exists
  const user = await AuthServices.loginUser(req.body);
  // Create tokens
const payload = { id: user._id, role: user.role };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  //  Set refresh token in secure cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in succesfully!",
    data: { accessToken, user },
  });
});


// ======================================================refresh token ==============================================


export const refreshAccessToken = catchAsync(
  async (req, res) => {
    const refreshToken =
      req.cookies?.refreshToken || req.headers["x-refresh-token"];

    if (!refreshToken) {
      throw new AppError(401, "Refresh token missing");
    }

    const accessToken = await AuthServices.handleRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
    });
  }
);









export const AuthControllers = {
  loginUser,
  refreshAccessToken,
  createUser,
};
